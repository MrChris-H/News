const { fetchTopics, insertTopics } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopics = (req, res, next) => {
  const { slug, description } = req.body;
  insertTopics(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })

    .catch((err) => {
      next(err);
    });
};
