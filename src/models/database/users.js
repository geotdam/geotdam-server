//유저 
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      userId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
      },
      name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      birth: DataTypes.DATE,
      gender: DataTypes.STRING,
      address: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      status: DataTypes.STRING,
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
      isLocationShared: {
        type: DataTypes.BOOLEAN,
        field: 'is_location_shared'
      }
    }, {
      tableName: 'users',
      timestamps: false
    });
  
    Users.associate = function(models) {
      Users.hasOne(models.socialLogins, { foreignKey: 'userId' });
      Users.hasOne(models.userImgs, { foreignKey: 'userId' });
      Users.hasMany(models.routes, { foreignKey: 'userId' });
      Users.hasMany(models.routeLikes, { foreignKey: 'userId' });
      Users.hasMany(models.routeBookmarks, { foreignKey: 'userId' });
      Users.hasMany(models.reviews, { foreignKey: 'userId' });
    };
  
    return Users;
  };
  