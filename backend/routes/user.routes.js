const express = require("express");
const router = express.Router();
const { getAgents, createAgent } = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/verifyToken");
const { authorizeRole } = require("../middleware/authorizeRole");

router.get("/", verifyToken, getAgents);
router.post("/create", verifyToken, authorizeRole("admin"), createAgent);

module.exports = router;
