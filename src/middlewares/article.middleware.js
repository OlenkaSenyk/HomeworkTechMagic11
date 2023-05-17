import Article from "../models/article.model.js";

export const checkArticleExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: "Article does not exist" });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const checkArticleExistsByTitle = async (req, res, next) => {
  try {
    const { title } = req.query.title;
    const article = await Article.find({ title: title });
    if (!article) {
      return res.status(404).json({ error: "Article does not exist" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
