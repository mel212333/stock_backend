const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StockMove = sequelize.define("stock_moves", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  move_type: { type: DataTypes.ENUM("IN", "OUT"), allowNull: false },
  qty: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  requester_id: { type: DataTypes.INTEGER, allowNull: true },
  sector_id: { type: DataTypes.INTEGER, allowNull: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  occurred_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: false });

module.exports = StockMove;
