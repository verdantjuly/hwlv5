const CommentService = require("../services/comments.service");

class CommentsController {
  commentService = new CommentService();
  viewcomments = async (req, res) => {
    const { postId } = req.params;
    const { status, message, comments } =
      await this.commentService.viewallcomments(postId);
    res.status(status).json({ message, comments });
  };
  createcomments = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;
    const { content } = req.body;
    const { status, message } = await this.commentService.writecomment(
      postId,
      userId,
      content
    );
    res.status(status).json(message);
  };
  editcomment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals;
    const { content } = req.body;
    const { status, message } = await this.commentService.updatecomment(
      commentId,
      userId,
      content
    );
    res.status(status).json({ message });
  };
  deletecomment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.commentService.removecomment(
      commentId,
      userId
    );
    res.status(status).json({ message });
  };
}
module.exports = CommentsController;
