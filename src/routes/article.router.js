import { Router } from "express";
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
  getArticlesByTitle,
  likeOrUnlikeArticle,
} from "../controllers/article.controller.js";
import {
  checkArticleExists,
  checkArticleExistsByTitle,
} from "../middlewares/article.middleware.js";

const articleRouter = Router();

articleRouter
  .get("/", getArticles)
  .get("/search", checkArticleExistsByTitle, getArticlesByTitle)
  .get("/:id", checkArticleExists, getArticleById)
  .post("/", createArticle)
  .put("/:id", checkArticleExists, updateArticleById)
  .delete("/:id", checkArticleExists, deleteArticleById)
  .post("/:id/like", checkArticleExists, likeOrUnlikeArticle);

export default articleRouter;
