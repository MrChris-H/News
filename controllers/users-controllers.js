const { checkExists } = require("../models/global-models");
const { fetchUsers, fetchUser } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  const proms = [
    fetchUser(username),
    checkExists("users", "username", username),
  ];
  Promise.all(proms)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
