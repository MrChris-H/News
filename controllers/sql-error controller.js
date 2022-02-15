exports.sqlErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid input type" });
  } else next(err);
};
