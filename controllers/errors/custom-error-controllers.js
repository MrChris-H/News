exports.customErr = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "resource not found") {
    res.status(404).send({ msg: "resource not found" });
  } else if (err.status === 400 && err.msg === "invalid sort query") {
    res.status(400).send({ msg: "invalid sort query" });
  } else if (err.status === 400 && err.msg === "invalid order query") {
    res.status(400).send({ msg: "invalid order query" });
  } else if (
    err.status === 404 &&
    err.msg === "no articles found for this topic"
  ) {
    res.status(404).send({ msg: "no articles found for this topic" });
  } else next(err);
};
