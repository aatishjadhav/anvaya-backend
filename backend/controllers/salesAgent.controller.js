const SalesAgent = require("../models/salesAgent.models");

const getAgents = async (req, res) => {
  try {
    const getAllAgents = await SalesAgent.find();
    res.status(200).json(getAllAgents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error.", error });
  }
};

const addAgent = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid input, name must be a string." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid input: 'email' must be a valid email address.",
      });
    }

    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res
        .status(409)
        .json({ error: `Sales agent with email ${email} already exist` });
    }

    const newAgents = new SalesAgent({ name, email });
    await newAgents.save();

    const formattedResponse = {
      id: newAgents._id,
      name: newAgents.name,
      email: newAgents.email,
    };
    res.status(201).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getAgents, addAgent };
