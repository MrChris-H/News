const { endPoints } = require("../controllers/api-controllers");
const { articlesRouter } = require("./api/articles-router");
const { topicsRouter } = require("./api/topics-router");
const { usersRouter } = require("./api/users-router");

const apiRouter = require("express").Router();

apiRouter.get("/", endPoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
// apiRouter.use("")

module.exports = { apiRouter };
