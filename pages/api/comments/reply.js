export const createReply = async (req, res) => {
  try {
    const { commentId } = req.query;
    const { content } = req.body;

    const parentComment =
      await Comment.findById(commentId);

    if (!parentComment) {
      return res.status(404).json({
        message: "Parent comment not found",
      });
    }

    const status =
      req.user.role === "admin"
        ? "approved"
        : "pending";

    const reply = await Comment.create({
      propertyId: parentComment.propertyId,
      parentId: commentId,
      userId: req.user.id,
      content,
      status,
    });

    return res.status(201).json({
      success: true,
      replyId: reply._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};