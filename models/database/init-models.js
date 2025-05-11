import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Placeimgs from  "./Placeimgs.js";
import _Placeroutes from  "./Placeroutes.js";
import _Places from  "./Places.js";
import _Reviews from  "./Reviews.js";
import _Routebookmarks from  "./Routebookmarks.js";
import _Routeimgs from  "./Routeimgs.js";
import _Routelikes from  "./Routelikes.js";
import _Routes from  "./Routes.js";
import _Sequelizemeta from  "./Sequelizemeta.js";
import _Sociallogins from  "./Sociallogins.js";
import _Userimgs from  "./Userimgs.js";
import _Users from  "./Users.js";

export default function initModels(sequelize) {
  const Placeimgs = _Placeimgs.init(sequelize, DataTypes);
  const Placeroutes = _Placeroutes.init(sequelize, DataTypes);
  const Places = _Places.init(sequelize, DataTypes);
  const Reviews = _Reviews.init(sequelize, DataTypes);
  const Routebookmarks = _Routebookmarks.init(sequelize, DataTypes);
  const Routeimgs = _Routeimgs.init(sequelize, DataTypes);
  const Routelikes = _Routelikes.init(sequelize, DataTypes);
  const Routes = _Routes.init(sequelize, DataTypes);
  const Sequelizemeta = _Sequelizemeta.init(sequelize, DataTypes);
  const Sociallogins = _Sociallogins.init(sequelize, DataTypes);
  const Userimgs = _Userimgs.init(sequelize, DataTypes);
  const Users = _Users.init(sequelize, DataTypes);

  Placeimgs.belongsTo(Places, { as: "place", foreignKey: "placeId"});
  Places.hasMany(Placeimgs, { as: "placeimgs", foreignKey: "placeId"});
  Placeroutes.belongsTo(Places, { as: "place", foreignKey: "placeId"});
  Places.hasMany(Placeroutes, { as: "placeroutes", foreignKey: "placeId"});
  Placeroutes.belongsTo(Routes, { as: "route", foreignKey: "routeId"});
  Routes.hasMany(Placeroutes, { as: "placeroutes", foreignKey: "routeId"});
  Reviews.belongsTo(Routes, { as: "route", foreignKey: "routeId"});
  Routes.hasMany(Reviews, { as: "reviews", foreignKey: "routeId"});
  Routebookmarks.belongsTo(Routes, { as: "route", foreignKey: "routeId"});
  Routes.hasMany(Routebookmarks, { as: "routebookmarks", foreignKey: "routeId"});
  Routeimgs.belongsTo(Routes, { as: "route", foreignKey: "routeId"});
  Routes.hasMany(Routeimgs, { as: "routeimgs", foreignKey: "routeId"});
  Routelikes.belongsTo(Routes, { as: "route", foreignKey: "routeId"});
  Routes.hasMany(Routelikes, { as: "routelikes", foreignKey: "routeId"});
  Reviews.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Reviews, { as: "reviews", foreignKey: "userId"});
  Routebookmarks.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Routebookmarks, { as: "routebookmarks", foreignKey: "userId"});
  Routelikes.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Routelikes, { as: "routelikes", foreignKey: "userId"});
  Routes.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Routes, { as: "routes", foreignKey: "userId"});
  Sociallogins.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Sociallogins, { as: "sociallogins", foreignKey: "userId"});
  Userimgs.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Userimgs, { as: "userimgs", foreignKey: "userId"});

  return {
    Placeimgs,
    Placeroutes,
    Places,
    Reviews,
    Routebookmarks,
    Routeimgs,
    Routelikes,
    Routes,
    Sequelizemeta,
    Sociallogins,
    Userimgs,
    Users,
  };
}
