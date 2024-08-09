import { Router } from "express";

const answerRouter = Router();

answerRouter.post("/:id/upvote", async (req, res) => {
  const answerIdFromClient = req.params.id;
  const upvoteFromClient = req.body;

  try {
    await connectionPool.query(
      `insert into answer_votes (answer_id, vote)
        values ($1, $2)`,
      [answerIdFromClient, upvoteFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not update vote because database connection`,
    });
  }

  return res.status(200).json({
    message: `Successfully upvoted the answer`,
  });
});

answerRouter.post("/:id/downvote", async (req, res) => {
  const answerIdFromClient = req.params.id;
  const downvoteFromClient = req.body;

  try {
    await connectionPool.query(
      `insert into answer_votes (answer_id, vote)
        values ($1, $2)`,
      [answerIdFromClient, downvoteFromClient]
    );
  } catch {
    return res.status(500).json({
      message: `Sever could not update vote because database connection`,
    });
  }

  return res.status(200).json({
    message: `Successfully downvoted the answer`,
  });
});

export default answerRouter;
