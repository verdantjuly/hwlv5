const { Likes, Posts, Users } = require("../models");
const { Op } = require("sequelize");

class LikeRepository {
  liker = async (postId, userId) => {
    const target = await Likes.findOne({
      where: { [Op.and]: [{ postId }, { userId }] },
    });
    if (!target) {
      const like = await Likes.create({ postId, userId });
      return like;
    } else {
      const like = await Likes.destroy({
        where: { [Op.and]: [{ postId }, { userId }] },
      });
      return like;
    }
  };

  likeslist = async (userId) => {
    const target = await Likes.findAll({ where: { userId } });
    const postIds = target.map((like) => {
      return like.postId;
    });
    const allpost = await Posts.findAll({
      include: [
        {
          model: Users,
          attributes: ["nickname"],
        },
      ],
    });
    const result = await Promise.all(
      allpost.map(async (post) => {
        const likesCount = await Likes.count({
          where: { postId: post.postId },
        });
        post.likesCount = likesCount;
        if (postIds.includes(post.postId)) {
          return post;
        } else {
          return null;
        }
      })
    );
    const answer = result.filter((item) => item !== null);
    return answer;
  };
}
module.exports = LikeRepository;
