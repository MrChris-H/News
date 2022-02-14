const express = require("express");
const { badPath } = require("./controllers/http-error-controller");
const { getTopics, getArticle } = require("./controllers/topics-controller");

const app = express();

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);

//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------

module.exports = app;
