const { Product } = require("../models");
const { Op } = require("sequelize");

exports.list = async (req, res) => {
    const where = { active: true };
if (q) where.name = { [Op.iLike]: `%${q}%` };

  try {
    const q = (req.query.q || "").trim();

    const where = { active: true };
    if (q) {
      // búsqueda simple por name (si querés más, lo mejoramos después)
      where.name = Product.sequelize.where(
        Product.sequelize.fn("LOWER", Product.sequelize.col("name")),
        "LIKE",
        `%${q.toLowerCase()}%`
      );
    }

    const rows = await Product.findAll({ where, order: [["name", "ASC"]] });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error listando productos" });
  }
};

exports.create = async (req, res) => {
  try {
    const { sku, name, description, unit, stock_min } = req.body;
    if (!name) return res.status(400).json({ error: "name requerido" });

    const row = await Product.create({
      sku: sku || null,
      name,
      description: description || null,
      unit: unit || "unidad",
      stock_min: stock_min ?? 0,
      active: true,
    });

    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando producto" });
  }
};
