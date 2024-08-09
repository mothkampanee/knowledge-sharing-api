import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import validationQuestion from "../middleware/question.validation.mjs";

const questionRouter = Router();

questionRouter.post("/", [validationQuestion], async (req, res) => {
  const newQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    await connectionPool.query(
      `insert into questions (title, description, category, created_at, updated_at)
        values ($1, $2, $3, $4, $5)`,
      [
        newQuestion.title,
        newQuestion.description,
        newQuestion.category,
        newQuestion.created_at,
        newQuestion.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not create question because database connection`,
    });
  }

  return res.status(201).json({
    message: `Create question successfully`,
  });
});

questionRouter.get("/", async (req, res) => {
  let result;

  try {
    result = await connectionPool.query(`select * from questions`);
  } catch {
    return res.status(500).json({
      message: `Server could not retrieves a list of all questions because database connection`,
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for`,
    });
  }

  return res.status(200).json({
    data: result.rows,
  });
});

questionRouter.get("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;
  let result;

  try {
    result = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not retrieves a specific question by its ID because database connection`,
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for (id: ${questionIdFromClient})`,
    });
  }

  return res.status(200).json({
    data: result.rows[0],
  });
});

questionRouter.put("/:id", [validationQuestion], async (req, res) => {
  const questionIdFromClient = req.params.id;
  const updateQuestion = { ...req.body, updated_at: new Date() };

  try {
    result = await connectionPool.query(
      `update questions
        set title = $2,
            description = $3,
            category = $4,
            updated_at = $5,
        where id = $1
        returning *`,
      [
        questionIdFromClient,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
        updateQuestion.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not update question because database connection`,
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for (id: ${questionIdFromClient})`,
    });
  }

  return res.status(200).json({
    message: `Successfully updated the question`,
  });
});

questionRouter.delete("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;

  if (!questionIdFromClient) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for (id: ${questionIdFromClient})`,
    });
  }

  try {
    await connectionPool.query(
      `delete from questions
            where id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not delete question because database connection`,
    });
  }

  return res.status(200).json({
    message: `Successfully deleted the question`,
  });
});

questionRouter.get("/", async (req, res) => {
  const title = req.query.title;
  const category = req.query.category;
  let result;

  try {
    result = await connectionPool.query(
      `select * from questions
            where
                (title = $1 or $1 is null or $1 = '')
            and
                (category = $2 or $2 is null or $2 = '')`,
      [title, category]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not question because database connection`,
    });
  }

  return res.status(200).json({
    data: result,
  });
});

questionRouter.post("/:id/answers", [validationQuestion], async (req, res) => {
  const questionIdFromClient = req.params.id;
  const newAnswer = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    await connectionPool.query(
      `insert into answers (question_id, content, created_at, updated_at)
        values ($1, $2, $3, $4)`,
      [
        questionIdFromClient,
        newAnswer.content,
        newAnswer.created_at,
        newAnswer.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not create answer because database connection`,
    });
  }

  return res.status(201).json({
    message: `Answer created successfully`,
  });
});

questionRouter.get("/:id/answers", async (req, res) => {
  const questionIdFromClient = req.params.id;
  let result;

  try {
    result = await connectionPool.query(
      `select * from answers where question_id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not retrieves answers for a specific question by its ID because database connection`,
    });
  }

  if (!result.rows[0]) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for (id: ${questionIdFromClient})`,
    });
  }

  return res.status(200).json({
    data: result.rows[0],
  });
});

questionRouter.delete("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;

  if (!questionIdFromClient) {
    return res.status(404).json({
      message: `The reason the data could not be located was that it was never stored in the database you asked for (id: ${questionIdFromClient})`,
    });
  }

  try {
    await connectionPool.query(
      `delete from answers
              where question_id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Server could not delete question because database connection`,
    });
  }

  return res.status(200).json({
    message: `Question and its answers deleted successfully`,
  });
});

questionRouter.post("/:id/upvote", async (req, res) => {
  const questionIdFromClient = req.params.id;
  const upvoteFromClient = req.body;

  console.log(upvoteFromClient);
  try {
    await connectionPool.query(
      `insert into question_votes (question_id, vote)
      values ($1, $2)`,
      [questionIdFromClient, upvoteFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not update vote because database connection`,
    });
  }

  return res.status(200).json({
    message: `Successfully upvoted the question`,
  });
});

questionRouter.post("/:id/downvote", async (req, res) => {
  const questionIdFromClient = req.params.id;
  const downvoteFromClient = req.body;

  try {
    await connectionPool.query(
      `insert into question_votes (question_id, vote)
        values ($1, $2)`,
      [questionIdFromClient, downvoteFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not update vote because database connection`,
    });
  }

  return res.status(200).json({
    message: `Successfully downvoted the question`,
  });
});

export default questionRouter;
