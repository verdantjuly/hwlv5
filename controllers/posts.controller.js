const PostService = require("../services/posts.service");

class PostsController {
  postService = new PostService();

  viewpostslist = async (req, res) => {
    const { status, message, list } = await this.postService.findAllPost();
    return res.status(status).json({ message, list });
  };

  viewonepost = async (req, res) => {
    const { postId } = req.params;
    const { post, message, status } = await this.postService.findOnePost(
      postId
    );
    return res.status(status).json({ message, post });
  };

  createPost = async (req, res) => {
    const { title, content } = req.body;
    const { userId } = res.locals;
    const { status, message } = await this.postService.createOnePost(
      title,
      content,
      userId
    );
    return res.status(status).json({ message });
  };

  editPost = async (req, res) => {
    const { title, content } = req.body;
    const { postId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.postService.editPost(
      title,
      content,
      postId,
      userId
    );
    return res.status(status).json({ message });
  };
  deletePost = async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.postService.deletePost(
      postId,
      userId
    );
    res.status(status).json({ message });
  };
}

module.exports = PostsController;
