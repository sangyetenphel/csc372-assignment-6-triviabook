# Triviabook API

A Node.js/Express REST API connected to a Neon PostgreSQL database. This API serves trivia questions, topics, and allows users to check answers or add new questions.

**Live Deployment:** [Live URL Pending - Update after Render deployment]

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