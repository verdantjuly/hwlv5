const PostRepository = require('../repositories/posts.repository');
const { Posts } = require('../models');
class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();
    if (allPost && !allPost[0]) {
      return {
        status: 200,
        message: '게시물이 없습니다. 첫 작성자가 되어 주세요.',
        allPost: null,
      };
    } else if (allPost) {
      return { status: 200, message: '게시글 조회에 성공하였습니다.', allPost };
    } else {
      return {
        status: 400,
        message: '게시물 조회에 실패하였습니다.',
        allPost: null,
      };
    }
  };
  findOnePost = async postId => {
    try {
      if (!postId) {
        return {
          status: 400,
          post: null,
          message: '게시물 상세 조회에 실패하였습니다.',
        };
      } else if (postId) {
        const post = await this.postRepository.findOnePost(postId);
        return {
          status: 200,
          post,
          message: '게시물 상세 조회에 성공하였습니다.',
        };
      }
    } catch (err) {
      return { status: 400, message: '게시물 상세 조회에 실패하였습니다.' };
    }
  };
  editPost = async (title, content, postId, userId) => {
    try {
      if (!title || !content || !postId || !userId) {
        return {
          status: 400,
          message: '미입력된 항목이 있습니다. 모든 항목을 입력해 주세요.',
        };
      }
      const target = await Posts.findOne({ where: { postId, userId } });
      if (!target) {
        return { status: 400, message: '게시글 수정에 실패하였습니다.' };
      }
      const post = await this.postRepository.editPost(title, content, postId);

      if (post) {
        return { status: 200, message: '게시물 수정에 성공하였습니다.' };
      } else {
        return { status: 400, message: '게시물 수정에 실패하였습니다.' };
      }
    } catch (err) {
      return { status: 400, message: '게시물 수정에 실패하였습니다.' };
    }
  };
  deletePost = async (postId, userId) => {
    if (!postId) {
      return {
        status: 400,
        message: '미입력된 항목이 있습니다. 모든 항목을 입력해 주세요.',
      };
    }
    const target = await Posts.findOne({ where: { postId, userId } });
    if (!target) {
      return { status: 400, message: '게시글 삭제에 실패하였습니다.' };
    }
    const editPost = await this.postRepository.deletePost(postId);
    if (editPost) {
      return { status: 200, message: '게시물 삭제에 성공하였습니다.' };
    } else {
      return { status: 400, message: '게시물 삭제에 실패하였습니다.' };
    }
  };

  createOnePost = async (title, content, userId) => {
    try {
      if (!title || !content || !userId) {
        return {
          status: 400,
          message: '미입력된 항목이 있습니다. 모두 입력하여 주세요.',
        };
      }
      const post = await this.postRepository.createOnePost(
        title,
        content,
        userId,
      );
      if (post) {
        return { status: 200, message: '게시물 작성에 성공하였습니다.' };
      }
    } catch (err) {
      return { status: 400, message: '게시물 작성에 실패하였습니다.' };
    }
  };
}

module.exports = PostService;
