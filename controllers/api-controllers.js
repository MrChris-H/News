const api = require("../endpoints.json");

exports.endPoints = (req, res, next) => {
  res.status(200).send({ api });
};
