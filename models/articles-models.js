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

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  if (
    !["article_id", "title", "author", "body", "created_at", "votes"].includes(
      sort_by
    )
  ) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }
  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  const queryValues = [];
  let queryStr = `
  SELECT articles.*, CAST(COUNT(comment_id)AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;
  if (topic !== undefined) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }
  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}
  ;`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};
