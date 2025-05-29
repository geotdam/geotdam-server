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
      phone: DataTypes.STRING,
      open_hours: DataTypes.STRING, 
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      location: DataTypes.GEOMETRY('POINT'),
      address: DataTypes.TEXT
    }, {
      tableName: 'places',
      timestamps: false
    });
  
    Places.associate = (models) => {
    Places.hasMany(models.PlaceImgs, { foreignKey: 'placeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
     });
    Places.hasMany(models.Routes, {  foreignKey: 'placeId',
      onDelete: 'CASCADE',  
      onUpdate: 'CASCADE'
    });
    };
    return Places;
  };
  