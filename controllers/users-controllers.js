const { fetchUsers } = require("../models/users-models");

exports.getUsers = () => {
  fetchUsers()
};
