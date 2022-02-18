const {
  getArticle,
  getArticles,
  patchArticle,
} = require("../../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
module.exports = { articlesRouter };
