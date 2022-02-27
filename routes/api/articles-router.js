const {
  getArticle,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticleByArticleId,
} = require("../../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../../controllers/comments-controllers");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = { articlesRouter };
