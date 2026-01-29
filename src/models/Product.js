const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sku: { type: DataTypes.TEXT, allowNull: true, unique: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  unit: { type: DataTypes.TEXT, allowNull: false, defaultValue: "unidad" },
  stock_min: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { timestamps: false });

module.exports = Product;
