const express = require("express");
const router = express.Router();
const { getAgents, addAgent } = require("../controllers/salesAgent.controller");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", getAgents);
router.post("/", verifyToken, addAgent);

module.exports = router;
