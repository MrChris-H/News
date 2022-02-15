const { fetchArticle, updateArticle } = require("../models/articles-models");
const { checkExists } = require("../models/global-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  const proms = [
    fetchArticle(article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(proms)
    .then(([article]) => {
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
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(proms)
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
