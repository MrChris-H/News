const express = require("express");
const {
  getArticle,
  patchArticle,
} = require("./controllers/article-controllers");
const { customErr } = require("./controllers/errors/custom-error-controller");
const {
  badPath,
  serverErr,
} = require("./controllers/errors/http-error-controller");
const { sqlErr } = require("./controllers/errors/sql-error-controller");
const { getTopics } = require("./controllers/topics-controller");

const app = express();
app.use(express.json());

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);
app.patch(`/api/articles/:article_id`, patchArticle);
//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------
app.use(sqlErr);
app.use(customErr);

app.use(serverErr);
module.exports = app;
