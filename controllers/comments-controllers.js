const res = require("express/lib/response");
const { checkExists } = require("../models/global-models");
const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentByCommentId,
  updateCommentByCommentId,
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
  const { username, body } = req.body;
  insertCommentByArticleId(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const proms = [
    removeCommentByCommentId(comment_id),
    checkExists("comments", "comment_id", comment_id),
  ];
  Promise.all(proms)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};


exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const proms = [
    updateCommentByCommentId(inc_votes, comment_id),
    checkExists("comments", "comment_id", comment_id),
  ];
  Promise.all(proms)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

