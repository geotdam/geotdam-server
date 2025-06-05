//유저
export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: "user_id",
      },
      name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birth: DataTypes.DATE,
      gender: DataTypes.STRING,
      address: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
      status: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
        field: "deleted_at",
      },
      isLocationShared: {
        type: DataTypes.BOOLEAN,
        field: "is_location_shared",
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  Users.associate = (models) => {
    Users.hasOne(models.SocialLogins, {
      foreignKey: "userId",
      as: "SocialLogin",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Users.hasOne(models.UserImgs, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Users.hasMany(models.Routes, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Users.hasMany(models.RouteLikes, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Users.hasMany(models.RouteBookmarks, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Users.hasMany(models.Reviews, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    //사용자가 남긴 장소 리뷰 연관추가 
    Users.hasMany(models.PlaceReviews, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Users;
};
