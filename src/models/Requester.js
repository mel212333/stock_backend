const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Requester = sequelize.define("requesters", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.TEXT, allowNull: false },
  sector_id: { type: DataTypes.INTEGER, allowNull: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { timestamps: false });

module.exports = Requester;
