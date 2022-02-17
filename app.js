const express = require("express");
const { endPoints } = require("./controllers/api-controllers");
const {
  getArticle,
  patchArticle,
  getArticles,
} = require("./controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/comments-controllers");
const { customErr } = require("./controllers/errors/custom-error-controllers");
const {
  badPath,
  serverErr,
} = require("./controllers/errors/http-error-controllers");
const { sqlErr } = require("./controllers/errors/sql-error-controllers");
const { getTopics } = require("./controllers/topics-controllers");
const { getUsers } = require("./controllers/users-controllers");

const app = express();
app.use(express.json());

app.get(`/api`, endPoints);
app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);
app.patch(`/api/articles/:article_id`, patchArticle);
app.get(`/api/users`, getUsers);
app.get(`/api/articles`, getArticles);
app.get(`/api/articles/:article_id/comments`, getCommentsByArticleId);
app.post(`/api/articles/:article_id/comments`, postCommentByArticleId);
app.delete(`/api/comments/:comment_id`, deleteCommentByCommentId);
//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------
app.use(sqlErr);
app.use(customErr);

app.use(serverErr);
module.exports = app;
