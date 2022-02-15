exports.customErr = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "article does not exist") {
    res.status(404).send({ msg: "article does not exist" });
  } else next(err);
};
