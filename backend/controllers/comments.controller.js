const mongoose = require("mongoose");
const Comment = require("../models/comments.models");

const getComments = async (req, res) => {
  try {
    const leadId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      res.status(404).json({ error: `Lead with ID ${leadId} not found.` });
    }
    const getAllComments = await Comment.find({ lead: leadId }).populate(
      "author",
      "name"
    );

    const formattedComments = getAllComments.map((comment) => ({
      id: comment._id.toString(),
      commentText: comment.commentText,
      author: comment.author.name,
      createdAt: comment.createdAt.toISOString(),
    }));

    return res.status(200).json(formattedComments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const addComment = async (req, res) => {
  try {
    const leadId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      res.status(404).json({ error: `Lead with ID ${leadId} not found.` });
    }

    const { author, commentText } = req.body;
    if (!commentText || typeof commentText !== "string") {
      res.status(400).json({ error: "comment text must be string." });
    }

    const addNewComment = new Comment({ lead: leadId, author, commentText });
    await addNewComment.save();
    await addNewComment.populate("author", "name");

    // Format response
    const formattedResponse = {
      id: addNewComment._id,
      commentText: addNewComment.commentText,
      author: addNewComment.author.name,
      createdAt: addNewComment.createdAt,
    };

    res.status(201).json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { getComments, addComment };
