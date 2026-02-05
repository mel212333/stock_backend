const { Product } = require("../models");
const { Op } = require("sequelize");


// PUT /api/products/:id
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, unit, stock_min, active } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    if (name != null) product.name = String(name).trim();
    if (unit != null) product.unit = String(unit).trim();
    if (stock_min != null) product.stock_min = Number(stock_min);
    if (active != null) product.active = Boolean(active);

    await product.save();
    return res.json(product);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error editando producto" });
  }
};

// DELETE /api/products/:id  (desactiva)
exports.remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    product.active = false;
    await product.save();

    return res.json({ ok: true, message: "Producto desactivado" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error desactivando producto" });
  }
};

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

exports.activate = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    product.active = true;
    await product.save();
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error activando producto" });
  }
};
