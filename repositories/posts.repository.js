const { Posts, Users, Likes } = require("../models");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    const allPosts = await sequelize.query(
      `SELECT u.nickname, p.title, p.content, p.createdAt, COUNT(l.postId) AS likesCount
        FROM Posts AS p
        LEFT JOIN Users as u on p.userId = u.userId 
        LEFT JOIN Likes as l on p.postId = l.postId
              GROUP BY p.postId
              ORDER BY p.createdAt DESC`,
      { type: QueryTypes.SELECT }
    );
    return allPosts;
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
  // 게시글 상세 조회 rawquery
  // 조호영 튜터 님이 알려 주심
  //   const post = await sequelize.query(
  //     `
  //   SELECT a.id, a.title, a.content, a.createdAt, c.email, COUNT(b.contentId) AS like_count,
  //          CASE WHEN
  //                 EXISTS(SELECT id from Likes where userId = :user_id and contentId = :post_id)
  //                 THEN 1 ELSE 0 END
  //               AS isLiked
  //   FROM posts as a
  //          LEFT JOIN Likes as b ON a.id = b.contentId
  //          LEFT JOIN Users as c on c.id = a.userId
  //   WHERE a.id = :post_id LIMIT 1;
  // `,
  //     {
  //       replacements: { post_id: postId, user_id: user.id },
  //       type: QueryTypes.SELECT,
  //     }
  //   );
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
