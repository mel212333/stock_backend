const sequelize = require("../config/database");

const User = require("./User");
const Sector = require("./Sector");
const Requester = require("./Requester");
const Product = require("./Product");
const StockMove = require("./StockMove");

// Relaciones
Sector.hasMany(Requester, { foreignKey: "sector_id" });
Requester.belongsTo(Sector, { foreignKey: "sector_id" });

Product.hasMany(StockMove, { foreignKey: "product_id" });
StockMove.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(StockMove, { foreignKey: "user_id" });
StockMove.belongsTo(User, { foreignKey: "user_id" });

Requester.hasMany(StockMove, { foreignKey: "requester_id" });
StockMove.belongsTo(Requester, { foreignKey: "requester_id" });

Sector.hasMany(StockMove, { foreignKey: "sector_id" });
StockMove.belongsTo(Sector, { foreignKey: "sector_id" });

module.exports = { sequelize, User, Sector, Requester, Product, StockMove };
