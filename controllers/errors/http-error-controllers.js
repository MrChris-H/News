exports.badPath = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};

exports.serverErr = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
