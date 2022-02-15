exports.customErr = (err, req, res, next) => {
  if (err.status === 404 && err.msg === "resource not found") {
    res.status(404).send({ msg: "resource not found" });
  } else next(err);
};
