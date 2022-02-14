const express = require("express");
const { getArticle } = require("./controllers/article-controllers");
const { customErr } = require("./controllers/custom-error-controller");
const { badPath, serverErr } = require("./controllers/http-error-controller");
const { getTopics } = require("./controllers/topics-controller");

const app = express();

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);

//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------

app.use(customErr);

app.use(serverErr);
module.exports = app;
