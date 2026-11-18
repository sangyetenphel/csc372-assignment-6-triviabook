/**
 * @file Router for all /triviabook endpoints.
 */

const express = require('express');
const asyncHandler = require('../middleware/async-handler');
const controller = require('../controllers/trivia-controller');

const router = express.Router();

router.get('/topics', asyncHandler(controller.listTopics));
router.get('/topic/:topic', asyncHandler(controller.listQuestionsInTopic));
router.get('/random', asyncHandler(controller.randomQuestion));
router.post('/answer', asyncHandler(controller.checkAnswer));
router.post('/question/add', asyncHandler(controller.addNewQuestion));

module.exports = router;