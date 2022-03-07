const express = require("express");
const cors = require("cors");
const { customErr } = require("./controllers/errors/custom-error-controllers");
const {
  badPath,
  serverErr,
} = require("./controllers/errors/http-error-controllers");
const { sqlErr } = require("./controllers/errors/sql-error-controllers");
const { apiRouter } = require("./routes/api-router");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

//--------------------------------------------------------------------------
app.all("/*", badPath); // 404 path not found
//--------------------------------------------------------------------------
app.use(sqlErr); // sql related errors
app.use(customErr); // custom errors
app.use(serverErr); // 500 internal server error

module.exports = app;
