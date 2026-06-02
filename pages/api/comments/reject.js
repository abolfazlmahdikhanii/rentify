export const rejectComment = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const { commentId } = req.query;

    await Comment.findByIdAndUpdate(commentId, {
      status: "rejected",
    });

    return res.json({
      success: true,
      message: "Comment rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};