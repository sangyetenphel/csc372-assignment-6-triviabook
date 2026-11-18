/**
 * @file Data-access functions for Triviabook topics and questions.
 */

const pool = require('../db');

/**
 * Returns all topic names.
 * @return {Promise<Array<{name: string}>>}
 */
async function getAllTopics() {
  const result = await pool.query('SELECT name FROM topics ORDER BY name');
  return result.rows;
}

/**
 * Finds a topic by name.
 * @param {string} topicName
 * @return {Promise<{id: number, name: string}|null>}
 */
async function getTopicByName(topicName) {
  const result = await pool.query('SELECT id, name FROM topics WHERE name = $1', [topicName]);
  return result.rows[0] || null;
}

/**
 * Returns questions for a topic, with optional limit and difficulty filter.
 * @param {number} topicId
 * @param {{limit?: number, difficulty?: string}} options
 * @return {Promise<Array>}
 */
async function getQuestionsByTopic(topicId, { limit, difficulty } = {}) {
  let query = 'SELECT id, question, answer, difficulty FROM questions WHERE topic_id = $1';
  const values = [topicId];

  if (difficulty) {
    values.push(difficulty);
    query += ` AND difficulty = $${values.length}`;
  }

  query += ' ORDER BY id';

  if (limit) {
    values.push(limit);
    query += ` LIMIT $${values.length}`;
  }

  const result = await pool.query(query, values);
  return result.rows;
}

/**
 * Returns one random question, excluding the answer.
 * @return {Promise<{id: number, question: string, difficulty: string}|null>}
 */
async function getRandomQuestion() {
  const result = await pool.query(
    'SELECT id, question, difficulty FROM questions ORDER BY RANDOM() LIMIT 1'
  );
  return result.rows[0] || null;
}

/**
 * Finds a question by id, including its answer.
 * @param {number} id
 * @return {Promise<{id: number, question: string, answer: string}|null>}
 */
async function getQuestionById(id) {
  const result = await pool.query(
    'SELECT id, question, answer FROM questions WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Adds a question. Creates the topic first if it does not exist.
 * @param {{topic: string, question: string, answer: string, difficulty: string}} data
 * @return {Promise<Array>} Updated list of questions for that topic.
 */
async function addQuestion({ topic, question, answer, difficulty }) {
  let topicRow = await getTopicByName(topic);
  if (!topicRow) {
    const inserted = await pool.query(
      'INSERT INTO topics (name) VALUES ($1) RETURNING id, name',
      [topic]
    );
    topicRow = inserted.rows[0];
  }

  await pool.query(
    'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
    [topicRow.id, question, answer, difficulty]
  );

  return getQuestionsByTopic(topicRow.id, {});
}

module.exports = {
  getAllTopics,
  getTopicByName,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion,
};