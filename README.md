# Triviabook API

A Node.js/Express REST API connected to a Neon PostgreSQL database. This API serves trivia questions, topics, and allows users to check answers or add new questions.

**Live Deployment:** [https://triviabook-api.onrender.com/triviabook/topics](https://triviabook-api.onrender.com/triviabook/topics)

## Database Schema

The database consists of two tables:

### `topics`
| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| `name` | TEXT | UNIQUE, NOT NULL | Topic name (e.g., 'science') |

### `questions`
| Column | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| `topic_id` | INTEGER | FOREIGN KEY (topics.id), NOT NULL | Links to the topic |
| `question` | TEXT | NOT NULL | The trivia question text |
| `answer` | TEXT | NOT NULL | The correct answer |
| `difficulty` | TEXT | NOT NULL, CHECK IN ('easy', 'medium', 'hard') | Question difficulty |

## Setup & Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory and add your Neon database connection string:
   ```env
   DATABASE_URL=postgresql://your-neon-connection-string
   PORT=3000
   ```
4. Run the seed script to create tables and populate initial data:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint | Description | Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/triviabook/topics` | Get a list of all trivia topics. | None |
| `GET` | `/triviabook/topic/:topic` | Get questions for a specific topic. | Optional query params: `?limit=5&difficulty=easy` |
| `GET` | `/triviabook/random` | Get a random question (does not include answer). | None |
| `POST` | `/triviabook/answer` | Check if a guess is correct. | JSON: `{ "id": 1, "guess": "Mars" }` |
| `POST` | `/triviabook/question/add` | Add a new question (creates topic if it doesn't exist). | JSON: `{ "topic": "history", "question": "Who...?", "answer": "Someone", "difficulty": "easy" }` |