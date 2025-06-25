const express = require("express");
const router = express.Router();
const {
    getComments,
    addComment,
} = require("../controllers/comments.controller");
const { verifyToken } = require("../middleware/verifyToken");
const { authorizeRole } = require("../middleware/authorizeRole");


router.get("/:id/comments", verifyToken, getComments);
router.post("/:id/comments", verifyToken, authorizeRole("agent"), addComment);

module.exports = router;
