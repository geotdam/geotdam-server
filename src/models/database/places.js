//장소
export default (sequelize, DataTypes) => {
    const Places = sequelize.define('Places', {
      placeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'place_id'
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      sequence: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      location: DataTypes.TEXT,
      address: DataTypes.TEXT
    }, {
      tableName: 'places',
      timestamps: false
    });
  
<<<<<<< HEAD
    Places.associate = (models) => {
    Places.hasMany(models.PlaceImgs, { foreignKey: 'placeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Places.hasMany(models.Routes, {  foreignKey: 'placeId',
=======
    Places.hasMany(sequelize.models.placeImgs, { foreignKey: 'placeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Places.hasMany(sequelize.models.routes, {  foreignKey: 'placeId',
>>>>>>> 209d3a7 (fix: sequlize instance 적용)
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
    });
    };
    return Places;
  };
  