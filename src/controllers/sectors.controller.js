const { Sector } = require("../models");

exports.list = async (req, res) => {
  try {
    const rows = await Sector.findAll({ where: { active: true }, order: [["name", "ASC"]] });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error listando sectores" });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name requerido" });

    const row = await Sector.create({ name, active: true });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando sector" });
  }
};
