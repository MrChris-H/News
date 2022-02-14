exports.customErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad article id" });
  } else if (err.status === 400 && err.msg === "article does not exist") {
    res.status(400).send({ msg: "article does not exist" });
  } else next(err);
};
