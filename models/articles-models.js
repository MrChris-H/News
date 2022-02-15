const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query(
      `
    SELECT articles.article_id, articles.title,articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`,
      [id]
    )
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
  const queryStr = `SELECT * FROM articles ORDER BY created_at DESC;`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
