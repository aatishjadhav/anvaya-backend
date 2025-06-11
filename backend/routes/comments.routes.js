const express = require("express");
const router = express.Router();
const {
    getComments,
    addComment,
} = require("../controllers/comments.controller");
const { verifyToken } = require("../middleware/verifyToken");


router.get("/:id/comments", verifyToken, getComments);
router.post("/:id/comments", verifyToken, addComment);

module.exports = router;
