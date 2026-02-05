const { Product } = require("../models");
const { Op } = require("sequelize");

// GET /api/products?q=
exports.list = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    const where = { active: true };
    if (q) where.name = { [Op.iLike]: `%${q}%` };

    const rows = await Product.findAll({
      where,
      order: [["name", "ASC"]],
    });

    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error listando productos" });
  }
};

// POST /api/products
exports.create = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const unit = (req.body.unit || "").trim();
    const stock_min = Number(req.body.stock_min) || 0;

    if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });
    if (!unit) return res.status(400).json({ error: "La unidad es obligatoria (ej: unidad, par, resma)" });
    if (stock_min < 0) return res.status(400).json({ error: "El stock mínimo no puede ser negativo" });

    // ✅ Evita duplicados por nombre (sin importar mayúsculas/minúsculas)
    const exists = await Product.findOne({
      where: { name: { [Op.iLike]: name } },
    });

    if (exists) {
      return res.status(409).json({
        error: `El producto "${exists.name}" ya existe. Para sumar stock hacé un movimiento IN en "Movimientos".`,
      });
    }

    const row = await Product.create({
      name,
      unit,
      stock_min,
      active: true,
    });

    return res.status(201).json(row);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error creando producto" });
  }
};
