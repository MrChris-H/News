const express = require("express");
const { badId } = require("./controllers/custom-error-controller");
const { badPath, serverErr } = require("./controllers/http-error-controller");
const { getTopics, getArticle } = require("./controllers/topics-controller");

const app = express();

app.get(`/api/topics`, getTopics);
app.get(`/api/articles/:article_id`, getArticle);

//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------

app.use(badId);

app.use(serverErr);
module.exports = app;
