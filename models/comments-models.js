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

exports.insertCommentByArticleId = (input, article_id) => {
  const { username, body } = input;
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
