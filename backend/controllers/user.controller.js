const User = require("../models/user.models");

const getUsers = async (req, res) => {
  try {
    const getAllUsers = await User.find({});
    if (getAllUsers) {
      return res.status(200).json(getAllUsers);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getUsers };
