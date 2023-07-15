'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Posts, {
        targetKey: 'postId',
        foreignKey: 'postId',
      });
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'userId',
      });
    }
  }
  Comments.init(
    {
      commentId: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      delete: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Comments',
    },
  );
  return Comments;
};
