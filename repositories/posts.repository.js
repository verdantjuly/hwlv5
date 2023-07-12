const { Posts, Users, Likes } = require("../models");

class PostRepository {
  findAllPost = async () => {
    let posts = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });
    posts = await posts.map(async (post) => {
      const likesCount = await Likes.count({
        where: { postId: post.postId },
      });
      post.likesCount = likesCount;
      return post;
    });
    const result = await Promise.all(posts);
    return result;
  };
  findOnePost = async (postId) => {
    let post = await Posts.findOne({
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
      where: { postId },
    });

    const likesCount = await Likes.count({
      where: { postId },
    });
    post.likesCount = likesCount;
    return post;
  };
  createOnePost = async (title, content, userId) => {
    const post = await Posts.create({
      title,
      content,
      userId,
    });
    return post;
  };
  editPost = async (title, content, postId) => {
    const post = await Posts.update(
      {
        title,
        content,
      },
      { where: { postId } }
    );
    return post;
  };
  deletePost = async (postId) => {
    const post = await Posts.destroy({ where: { postId } });
    return post;
  };
}

module.exports = PostRepository;
