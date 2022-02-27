const {
  fetchArticle,
  updateArticle,
  fetchArticles,
  insertArticle,
} = require("../models/articles-models");
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

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const proms = [fetchArticles(sort_by, order, topic)];
  if (topic !== undefined) proms.push(checkExists("topics", "slug", topic));
  Promise.all(proms)
    .then(([articles]) => {
      if (articles.length === 0 && topic !== undefined) {
        return Promise.reject({
          status: 404,
          msg: "no articles found for this topic",
        });
      }
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { username, title, body, topic } = req.body;
  insertArticle(username, title, body, topic)
    .then((article) => {
      res.status(201).send({ article });
    })

    .catch((err) => {
      next(err);
    });
};
