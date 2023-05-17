import Article from "../models/article.model.js";
import User from "../models/user.model.js";

export const getArticles = async (req, res, next) => {
  try {
    const result = await Article.find().populate(
      "owner",
      "fullName email age role -_id"
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Article.findById(
      id,
      "_id title subtitle description category owner"
    ).populate("owner", "fullName email age -_id");

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getArticlesByTitle = async (req, res, next) => {
  try {
    const { title, page = 1, limit = 5 } = req.query;

    const articles = await Article.find({ title: title })
      .populate("owner", "fullName email age -_id")
      .skip((page - 1) * limit)
      .limit(limit);

    const generalArticles = await Article.countDocuments({ title: title });
    const firstShownArticle = (page - 1) * limit + 1;
    const lastShownArticle = Math.min(page * limit, generalArticles);

    return res.status(200).json({
      articles,
      shownArticles: `${firstShownArticle}-${lastShownArticle}`,
      generalArticles: generalArticles,
    });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const { title, subtitle, description, owner, category } = req.body;
    const user = await User.findById(owner);

    if (user) {
      const article = new Article({
        title,
        subtitle,
        description,
        owner,
        category,
      });
      const result = await article.save();
      user.articles.push(result._id);
      user.numberOfArticles++;
      await user.save();
      return res.status(201).json(result);
    } else {
      return res.status(404).json({ error: "User does not exist" });
    }
  } catch (err) {
    next(err);
  }
};

export const updateArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, category } = req.body;

    const article = await Article.findByIdAndUpdate(id, {
      title,
      subtitle,
      description,
      category,
    });
    const result = await article.save();
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndRemove(id);
    const user = await User.findById(article.owner);
    user.articles.pull(article._id);
    user.numberOfArticles--;
    user.save();
    return res.status(200).json({ message: "Article was deleted" });
  } catch (err) {
    next(err);
  }
};

export const likeOrUnlikeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.query;
    const { userId } = req.body;

    const article = await Article.findById(id);
    const user = await User.findById(userId);

    if (action === "like") {
      user.likedArticles.push(id);
      article.likes.push(userId);
      await article.save();
      await user.save();
      return res.status(200).json({ message: "Article was liked" });
    } else if (action === "unlike") {
      const like = user.likedArticles.indexOf(id);
      user.likedArticles.splice(like, 1);
      article.likes.pull(userId);
      await article.save();
      await user.save();
      return res.status(200).json({ message: "Article was unliked" });
    } else {
      return res.status(400).json({ error: "Error action" });
    }
  } catch (err) {
    next(err);
  }
};
