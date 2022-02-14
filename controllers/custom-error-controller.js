exports.customErr = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "id does not exist" });
  } else next(err);
};
