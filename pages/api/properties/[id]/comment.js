export const getPropertyComments = async (req, res) => {
  await connectToDB();

  try {
    const { propertyId } = req.query;

    const comments = await Comment.find({
      propertyId,
      status: "approved",
      parentId: null,
    })
      .populate("user", "name lastName avatar role")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name lastName avatar role",
        },
      })
      .sort({
        createdAt: 1,
      });

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
