const LikeRepository = require("../repositories/likes.repository");
const { Likes } = require("../models");

class LikeService {
  likeRepository = new LikeRepository();
  liker = async (postId, userId) => {
    const like = await this.likeRepository.liker(postId, userId);
    if (postId && userId && like) {
      return { status: 200, message: "좋아요 적용에 성공하였습니다." };
    } else {
      return { status: 400, message: "좋아요 적용에 실패하였습니다." };
    }
  };
  likeslist = async (userId) => {
    const allPosts = await this.likeRepository.likeslist(userId);

    if (allPosts) {
      return {
        status: 200,
        message: "좋아요 게시글 조회에 성공하였습니다.",
        allPosts,
      };
    } else {
      return {
        status: 400,
        message: "좋아요 게시글 조회에 실패하였습니다.",
        allPost: null,
      };
    }
  };
}

module.exports = LikeService;
