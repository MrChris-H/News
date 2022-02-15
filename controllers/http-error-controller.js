
exports.badPath = (req, res) => {
  res.status(404).send({ msg: "path not found" });
};
