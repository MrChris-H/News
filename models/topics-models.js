const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.insertTopics = (slug, description) => {
  const insertStr = `
INSERT INTO topics
  (slug, description)
VALUES 
  ($1, $2)
  RETURNING*
;`;
  const queryArr = [slug, description];
  return db.query(insertStr, queryArr).then(({ rows }) => {
    return rows[0];
  });
};
