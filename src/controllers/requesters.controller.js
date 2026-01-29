const { Requester, Sector } = require("../models");

exports.list = async (req, res) => {
  try {
    const rows = await Requester.findAll({
      where: { active: true },
      include: [{ model: Sector, attributes: ["id", "name"] }],
      order: [["full_name", "ASC"]],
    });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error listando solicitantes" });
  }
};

exports.create = async (req, res) => {
  try {
    const { full_name, sector_id } = req.body;
    if (!full_name) return res.status(400).json({ error: "full_name requerido" });

    const row = await Requester.create({
      full_name,
      sector_id: sector_id || null,
      active: true,
    });

    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando solicitante" });
  }
};
