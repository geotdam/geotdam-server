var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _jwtToken = require("./jwtToken");
var _placeImgs = require("./placeImgs");
var _placeRoutes = require("./placeRoutes");
var _places = require("./places");
var _reviews = require("./reviews");
var _routeBookmarks = require("./routeBookmarks");
var _routeImgs = require("./routeImgs");
var _routeLikes = require("./routeLikes");
var _routes = require("./routes");
var _socialLogins = require("./socialLogins");
var _userImgs = require("./userImgs");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var jwtToken = _jwtToken(sequelize, DataTypes);
  var placeImgs = _placeImgs(sequelize, DataTypes);
  var placeRoutes = _placeRoutes(sequelize, DataTypes);
  var places = _places(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var routeBookmarks = _routeBookmarks(sequelize, DataTypes);
  var routeImgs = _routeImgs(sequelize, DataTypes);
  var routeLikes = _routeLikes(sequelize, DataTypes);
  var routes = _routes(sequelize, DataTypes);
  var socialLogins = _socialLogins(sequelize, DataTypes);
  var userImgs = _userImgs(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  placeImgs.belongsTo(places, { as: "place", foreignKey: "place_id"});
  places.hasMany(placeImgs, { as: "placeImgs", foreignKey: "place_id"});
  placeRoutes.belongsTo(places, { as: "place", foreignKey: "place_id"});
  places.hasMany(placeRoutes, { as: "placeRoutes", foreignKey: "place_id"});
  placeRoutes.belongsTo(routes, { as: "route", foreignKey: "route_id"});
  routes.hasMany(placeRoutes, { as: "placeRoutes", foreignKey: "route_id"});
  reviews.belongsTo(routes, { as: "route", foreignKey: "route_id"});
  routes.hasMany(reviews, { as: "reviews", foreignKey: "route_id"});
  routeBookmarks.belongsTo(routes, { as: "route", foreignKey: "route_id"});
  routes.hasMany(routeBookmarks, { as: "routeBookmarks", foreignKey: "route_id"});
  routeImgs.belongsTo(routes, { as: "route", foreignKey: "route_id"});
  routes.hasMany(routeImgs, { as: "routeImgs", foreignKey: "route_id"});
  routeLikes.belongsTo(routes, { as: "route", foreignKey: "route_id"});
  routes.hasMany(routeLikes, { as: "routeLikes", foreignKey: "route_id"});
  jwtToken.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(jwtToken, { as: "jwtTokens", foreignKey: "user_id"});
  reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user_id"});
  routeBookmarks.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(routeBookmarks, { as: "routeBookmarks", foreignKey: "user_id"});
  routeLikes.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(routeLikes, { as: "routeLikes", foreignKey: "user_id"});
  routes.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(routes, { as: "routes", foreignKey: "user_id"});
  socialLogins.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(socialLogins, { as: "socialLogins", foreignKey: "user_id"});
  userImgs.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(userImgs, { as: "userImgs", foreignKey: "user_id"});

  return {
    SequelizeMeta,
    jwtToken,
    placeImgs,
    placeRoutes,
    places,
    reviews,
    routeBookmarks,
    routeImgs,
    routeLikes,
    routes,
    socialLogins,
    userImgs,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

