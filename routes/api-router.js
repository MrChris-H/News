const { endPoints } = require("../controllers/api-controllers");
const { topicsRouter } = require("./api/topics-router");

const apiRouter = require("express").Router();

apiRouter.get("/", endPoints);
apiRouter.use("/topics", topicsRouter);

module.exports = {apiRouter};
