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

articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = { articlesRouter };
