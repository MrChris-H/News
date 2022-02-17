const db = require("../db/connection");

exports.fetchArticle = (id) => {
  return db
    .query(
      `
    SELECT articles.*, CAST(COUNT(comment_id)AS INT) AS comment_count
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
  const queryStr = `
  SELECT articles.*, CAST(COUNT(comment_id)AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  ;`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
