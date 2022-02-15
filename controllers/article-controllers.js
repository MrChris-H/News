const {
  fetchArticle,
  updateArticle,
  checkArticleExists,
} = require("../models/articles-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const proms = [
    updateArticle(inc_votes, article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(proms)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
