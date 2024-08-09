const validationQuestion = (req, res, next) => {
  if (!req.body.title && !req.body.description && !req.body.category) {
    return res.status(400).json({
      message: `Missing or invalid request data (.post/questions: title, description, category)`,
    });
  }

  if (!req.body.content) {
    return res.status(400).json({
      message: `Missing or invalid request data (.post/questions/:id: content)`,
    });
  }

  next();
};

export default validationQuestion;
