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
const { apiRouter } = require("./routes/api-router");

const app = express();
app.use(express.json());
app.use("/api", apiRouter);

//--------------------------------------------------------------------------
app.all("/*", badPath); // 404 path not found
//--------------------------------------------------------------------------
app.use(sqlErr);  // sql related errors
app.use(customErr); // custom errors
app.use(serverErr); // 500 internal server error
module.exports = app;
