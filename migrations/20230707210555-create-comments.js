'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      commentId: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      postId: {
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'postId',
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      delete: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  },
};
