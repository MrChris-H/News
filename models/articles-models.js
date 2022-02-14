const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 400, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.updateArticle = (votes, id) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = $1
  WHERE article_id = $2 
  RETURNING*
  `,
      [votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
