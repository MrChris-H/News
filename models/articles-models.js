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

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  limit = 10,
  offset = 0
) => {
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
  if (!/^\d+$/.test(limit)) {
    return Promise.reject({ status: 400, msg: "invalid limit query" });
  }
  if (!/^\d+$/.test(offset)) {
    return Promise.reject({ status: 400, msg: "invalid offset query" });
  }
  const p = offset * limit;
  const queryValues = [];
  let queryStr = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(*) OVER()AS INT) AS full_count , CAST(COUNT(comment_id)AS INT) AS comment_count
  FROM articles 
  LEFT JOIN comments
  ON comments.article_id = articles.article_id`;
  if (topic !== undefined) {
    queryValues.push(topic);
    queryStr += ` WHERE topic = $1`;
  }
  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}
  LIMIT  ${limit}
  OFFSET ${p};`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertArticle = (username, title, body, topic) => {
  const insertStr = `
  INSERT INTO articles
    (author, title, body, topic)
  VALUES 
    ($1, $2, $3, $4)
    RETURNING*
  ;`;
  const queryArr = [username, title, body, topic];
  return db.query(insertStr, queryArr).then(({ rows }) => {
    rows[0].comment_count = 0;

    return rows[0];
  });
};

exports.removeArticleByArticleId = (article_id) => {
  console.log(article_id);
  const insertStr = `
  DELETE FROM articles
  WHERE article_id = $1
  RETURNING*;
  `;
  return db.query(insertStr, [article_id]).then(({ rows }) => {
    console.log(rows);
  });
};
