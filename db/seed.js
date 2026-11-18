/**
 * @file Seeds the Triviabook database with starter topics and questions.
 * Run with: npm run seed
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon in many Node environments
});

const topics = ['science', 'geography'];

const scienceQuestions = [
  { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
  { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' },
];

const geographyQuestions = [
  { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
  { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' },
];

/**
 * Inserts a topic if it does not exist and returns its id.
 * @param {string} topicName - The name of the topic.
 * @return {Promise<number>} The topic id.
 */
async function getOrCreateTopic(topicName) {
  const existing = await pool.query('SELECT id FROM topics WHERE name = $1', [topicName]);
  if (existing.rows.length > 0) {
    return existing.rows[0].id;
  }
  const inserted = await pool.query(
    'INSERT INTO topics (name) VALUES ($1) RETURNING id',
    [topicName]
  );
  return inserted.rows[0].id;
}

/**
 * Seeds the database with topics and questions.
 */
async function seed() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
      );
    `);

    const scienceId = await getOrCreateTopic('science');
    const geographyId = await getOrCreateTopic('geography');

    for (const q of scienceQuestions) {
      await pool.query(
        'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
        [scienceId, q.question, q.answer, q.difficulty]
      );
    }

    for (const q of geographyQuestions) {
      await pool.query(
        'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
        [geographyId, q.question, q.answer, q.difficulty]
      );
    }

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await pool.end();
  }
}

seed();