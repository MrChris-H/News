const express = require("express");
const {
  getArticle,
  patchArticle,
} = require("./controllers/article-controllers");
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

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);
app.patch(`/api/articles/:article_id`, patchArticle);
app.get(`/api/users`, getUsers);
//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------
app.use(sqlErr);
app.use(customErr);

app.use(serverErr);
module.exports = app;
