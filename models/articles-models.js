const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
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

exports.checkArticleExists = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    });
};
