/**
 * @file Request handlers for the Triviabook API.
 */

const model = require('../models/trivia-model');

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * GET /triviabook/topics
 */
async function listTopics(req, res) {
  const topics = await model.getAllTopics();
  res.json(topics);
}

/**
 * GET /triviabook/topic/:topic?limit=&difficulty=
 */
async function listQuestionsInTopic(req, res) {
  const topicName = req.params.topic;
  const topic = await model.getTopicByName(topicName);

  if (!topic) {
    return res.status(404).json({ error: `Topic "${topicName}" not found.` });
  }

  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const difficulty = req.query.difficulty;

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    return res.status(400).json({ error: 'limit must be a positive integer.' });
  }

  if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ error: 'difficulty must be easy, medium, or hard.' });
  }

  const questions = await model.getQuestionsByTopic(topic.id, { limit, difficulty });
  res.json(questions);
}

/**
 * GET /triviabook/random
 */
async function randomQuestion(req, res) {
  const question = await model.getRandomQuestion();

  if (!question) {
    return res.status(404).json({ error: 'No questions available.' });
  }

  res.json(question);
}

/**
 * POST /triviabook/answer
 * Body: { id, guess }
 */
async function checkAnswer(req, res) {
  const { id, guess } = req.body;

  if (id === undefined || guess === undefined) {
    return res.status(400).json({ error: 'Both id and guess are required.' });
  }

  const question = await model.getQuestionById(Number(id));

  if (!question) {
    return res.status(404).json({ error: `Question with id ${id} not found.` });
  }

  const isCorrect =
    String(guess).trim().toLowerCase() === String(question.answer).trim().toLowerCase();

  res.json({
    correct: isCorrect,
    answer: question.answer,
  });
}

/**
 * POST /triviabook/question/add
 * Body: { topic, question, answer, difficulty }
 */
async function addNewQuestion(req, res) {
  const { topic, question, answer, difficulty } = req.body;

  if (!topic || !question || !answer || !difficulty) {
    return res.status(400).json({
      error: 'topic, question, answer, and difficulty are required.',
    });
  }

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({
      error: 'difficulty must be easy, medium, or hard.',
    });
  }

  const updatedQuestions = await model.addQuestion({
    topic,
    question,
    answer,
    difficulty,
  });

  res.status(201).json(updatedQuestions);
}

module.exports = {
  listTopics,
  listQuestionsInTopic,
  randomQuestion,
  checkAnswer,
  addNewQuestion,
};