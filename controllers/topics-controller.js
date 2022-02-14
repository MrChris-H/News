const { fetchTopics, fetchArticle } = require("../models/topics-methods");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      console.log({ article });
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
