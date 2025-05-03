//리뷰
module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define('Reviews', {
    reviewId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      field: 'review_id'
    },
    routeId: {
      type: DataTypes.BIGINT,
      field: 'route_id'
    },
    userId: {
      type: DataTypes.BIGINT,
      field: 'user_id'
    },
    comment: DataTypes.TEXT,
    rates: DataTypes.FLOAT,
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    tableName: 'reviews',
    timestamps: false
  });

  Reviews.associate = function(models) {
    Reviews.belongsTo(models.users, { foreignKey: 'userId' });
    Reviews.belongsTo(models.routes, { foreignKey: 'routeId' });
  };

  return Reviews;
};
