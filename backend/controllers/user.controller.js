const User = require("../models/user.models");

const getAgents = async (req, res) => {
  try {
    const getAllAgents = await User.find({});
    if (getAllAgents) {
      return res.status(200).json(getAllAgents);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};


const createAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Agent with this email already exists." });
    }

    const newAgent = new User({
      name,
      email,
      role: "salesAgent", 
    });

    const savedAgent = await newAgent.save();

    res.status(201).json({
      _id: savedAgent._id,
      name: savedAgent.name,
      email: savedAgent.email,
      role: savedAgent.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { getAgents, createAgent };
