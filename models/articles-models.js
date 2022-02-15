const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticle = (votes, id) => {
  const queryValues = [votes, id];
  const insertStr = `
  UPDATE articles  
  SET votes = votes + $1 
  WHERE article_id = $2 
  RETURNING*;
  `;
  return db.query(insertStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};

exports.fetchArticles = () => {
  const queryStr = `SELECT * FROM articles ORDER BY created_at desc`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
