const { endPoints } = require("../controllers/api-controllers");
const { articlesRouter } = require("./api/articles-router");
const { topicsRouter } = require("./api/topics-router");

const apiRouter = require("express").Router();

apiRouter.get("/", endPoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
module.exports = { apiRouter };
