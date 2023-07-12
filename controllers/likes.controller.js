const LikeService = require("../services/likes.service");

class LikesController {
  likeService = new LikeService();
  liker = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.likeService.liker(postId, userId);
    return res.status(status).json(message);
  };
  likeslist = async (req, res) => {
    const { userId } = res.locals;
    const { status, message, list } = await this.likeService.likeslist(userId);
    return res.status(status).json({ message, list });
  };
}

module.exports = LikesController;
