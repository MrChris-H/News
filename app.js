const express = require("express");
const { badPath } = require("./controllers/http-error-controller");
const { getTopics } = require("./controllers/topics-controller");

const app = express();

app.get(`/api/topics`, getTopics);

//--------------------------------------------------------------------------
app.all("/*", badPath);
//--------------------------------------------------------------------------

module.exports = app;
