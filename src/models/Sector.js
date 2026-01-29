const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Sector = sequelize.define("sectors", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false, unique: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { timestamps: false });

module.exports = Sector;
