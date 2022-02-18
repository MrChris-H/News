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

exports.insertCommentByArticleId = (username, body, article_id) => {
  const insertStr = `
  INSERT INTO comments
    (body, article_id, author)
  VALUES 
    ($1, $2, $3)
    RETURNING*
  ;`;
  const queryArr = [body, article_id, username];
  return db.query(insertStr, queryArr).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeCommentByCommentId = (comment_id) => {
  const insertStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING*;
  `;
  return db.query(insertStr, [comment_id]).then(() => {});
};

exports.updateCommentByCommentId = (votes, comment_id) => {
  const queryValues = [votes, comment_id];
  const insertStr = `
  UPDATE comments  
  SET votes = votes + $1 
  WHERE comment_id = $2 
  RETURNING*;
  `;
  return db.query(insertStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};