const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  const insertStr = `
  SELECT * 
  FROM comments
  WHERE article_id = $1
  ;`;
  return db.query(insertStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};
