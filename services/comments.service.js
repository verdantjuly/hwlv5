const CommentRepository = require("../repositories/comments.repository");
const { Comments } = require("../models");

class CommentService {
  commentRepository = new CommentRepository();

  viewallcomments = async (postId) => {
    if (!postId) {
      return { status: 400, message: "댓글 조회에 실패하였습니다." };
    }
    try {
      const allcomments = await this.commentRepository.viewallcomments(postId);
      if (!allcomments[0]) {
        return {
          status: 200,
          message: "댓글이 없습니다. 첫 작성자가 되어 주세요.",
          comments: null,
        };
      } else if (allcomments[0].content) {
        allcomments.sort((prev, next) => {
          return next.createdAt - prev.createdAt;
        });
        const comments = allcomments.map((comment) => {
          return {
            nickname: comment.User.nickname,
            content: comment.content,
            createdAt: comment.createdAt,
          };
        });
        return {
          status: 200,
          message: "댓글 조회에 성공하였습니다.",
          comments,
        };
      }
    } catch (err) {
      return err;
      // return {
      //   status: 400,
      //   message: "댓글 조회에 실패하였습니다.",
      //   comments: null,
      // };
    }
  };
  writecomment = async (postId, userId, content) => {
    try {
      if (!content) {
        return { status: 400, message: "댓글 내용을 입력해주세요" };
      }
      const comment = await this.commentRepository.writecomment(
        postId,
        userId,
        content
      );
      if (comment) {
        return { status: 200, message: "댓글 작성에 성공하였습니다." };
      } else {
        return { status: 400, message: "댓글 작성에 실패하였습니다." };
      }
    } catch (err) {
      return { status: 400, message: "댓글 작성에 실패하였습니다." };
    }
  };
  updatecomment = async (commentId, userId, content) => {
    try {
      if (!content) {
        return { status: 400, message: "댓글 내용을 입력해주세요" };
      }
      if (!commentId || !userId) {
        return { status: 400, message: "댓글 수정에 실패하였습니다." };
      }
      const target = await Comments.findOne({ where: { commentId, userId } });
      if (!target) {
        return { status: 400, message: "댓글 수정에 실패하였습니다." };
      }

      const comment = await this.commentRepository.updatecomment(
        commentId,
        userId,
        content
      );
      if (comment) {
        return { status: 200, message: "댓글 수정에 성공하였습니다." };
      } else {
        return { status: 400, message: "댓글 수정에 실패하였습니다." };
      }
    } catch (err) {
      return { status: 400, message: "댓글 수정에 실패하였습니다." };
    }
  };
  removecomment = async (commentId, userId) => {
    try {
      if (!commentId) {
        return { status: 400, message: "댓글 삭제에 실패하였습니다." };
      }
      const target = await Comments.findOne({ where: { commentId, userId } });
      if (!target) {
        return { status: 400, message: "댓글 삭제에 실패하였습니다." };
      }
      const comment = await this.commentRepository.removecomment(
        commentId,
        userId
      );

      if (comment && !comment.content) {
        return { status: 200, message: "댓글 삭제에 성공하였습니다." };
      } else {
        return { status: 400, message: "댓글 삭제에 실패하였습니다." };
      }
    } catch (err) {
      return { status: 400, message: "댓글 삭제에 실패하였습니다." };
    }
  };
}

module.exports = CommentService;
