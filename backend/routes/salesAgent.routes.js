const express = require("express");
const router = express.Router();
const { getAgents, addAgent } = require("../controllers/salesAgent.controller");
const { verifyToken } = require("../middleware/verifyToken");
const { authorizeRole } = require("../middleware/authorizeRole");

router.get("/", getAgents);
router.post("/", verifyToken, authorizeRole("admin"), addAgent);

module.exports = router;
