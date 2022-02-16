const res = require("express/lib/response");
const { checkExists } = require("../models/global-models");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const proms = [
    fetchCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ];
  Promise.all(proms)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  const proms = [
    insertCommentByArticleId(body, article_id),
    checkExists("articles", "article_id", article_id),
  ];

  Promise.all(proms)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
