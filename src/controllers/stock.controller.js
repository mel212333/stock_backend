const { sequelize, StockMove } = require("../models");


// stock actual por producto (sum IN - OUT)
exports.current = async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT
        p.id,
        p.name,
        p.unit,
        p.stock_min,
        COALESCE(SUM(CASE WHEN m.move_type = 'IN'  THEN m.qty ELSE 0 END), 0)
      - COALESCE(SUM(CASE WHEN m.move_type = 'OUT' THEN m.qty ELSE 0 END), 0)
        AS stock_current
      FROM products p
      LEFT JOIN stock_moves m ON m.product_id = p.id
      WHERE p.active = TRUE
      GROUP BY p.id
      ORDER BY p.name;
    `);

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo stock" });
  }
};

// helper para stock de 1 producto
async function getStockForProduct(product_id) {
  const [rows] = await sequelize.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN move_type='IN' THEN qty ELSE 0 END),0)
    - COALESCE(SUM(CASE WHEN move_type='OUT' THEN qty ELSE 0 END),0) AS stock
    FROM stock_moves
    WHERE product_id = :product_id
    `,
    { replacements: { product_id } }
  );
  return Number(rows?.[0]?.stock || 0);
}


async function getStockForProduct(product_id) {
  const [rows] = await sequelize.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN move_type='IN' THEN qty ELSE 0 END),0)
    - COALESCE(SUM(CASE WHEN move_type='OUT' THEN qty ELSE 0 END),0) AS stock
    FROM stock_moves
    WHERE product_id = :product_id
    `,
    { replacements: { product_id } }
  );
  return Number(rows?.[0]?.stock || 0);
}

exports.createMove = async (req, res) => {
  try {
    const { product_id, move_type, qty, notes, occurred_at } = req.body;

    if (!product_id || !move_type || !qty) {
      return res.status(400).json({ error: "product_id, move_type, qty requeridos" });
    }
    if (!["IN", "OUT"].includes(move_type)) {
      return res.status(400).json({ error: "move_type debe ser IN o OUT" });
    }

    const qtyNum = Number(qty);
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      return res.status(400).json({ error: "qty inválido" });
    }

    // ✅ si es OUT, validar que no quede stock negativo
    if (move_type === "OUT") {
      const stock = await getStockForProduct(product_id);
      if (stock < qtyNum) {
        return res.status(400).json({ error: `Stock insuficiente. Disponible: ${stock}` });
      }
    }

    // ✅ NO exigimos sector_id ni requester_id
    const move = await StockMove.create({
      product_id,
      move_type,
      qty: qtyNum,
      user_id: req.user.id,
      occurred_at: occurred_at ? new Date(occurred_at) : new Date(),
      notes: notes || null,
      sector_id: null,
      requester_id: null,
    });

    return res.status(201).json(move);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error creando movimiento" });
  }
};



exports.history = async (req, res) => {
  try {
    // filtros opcionales
    const { product_id, sector_id, user_id, from, to, limit } = req.query;

    const replacements = {
      product_id: product_id || null,
      sector_id: sector_id || null,
      user_id: user_id || null,
      from: from || null,
      to: to || null,
      limit: Number(limit) || 200,
    };

    const [rows] = await sequelize.query(
      `
      SELECT
        m.id,
        m.occurred_at,
        m.move_type,
        m.qty,
        p.name AS product,
        COALESCE(r.full_name, '-') AS requester,
        COALESCE(s.name, '-') AS sector,
        u.full_name AS registered_by,
        m.notes
      FROM stock_moves m
      JOIN products p ON p.id = m.product_id
      JOIN users u ON u.id = m.user_id
      LEFT JOIN requesters r ON r.id = m.requester_id
      LEFT JOIN sectors s ON s.id = m.sector_id
      WHERE
        (:product_id::int IS NULL OR m.product_id = :product_id::int)
        AND (:sector_id::int IS NULL OR m.sector_id = :sector_id::int)
        AND (:user_id::int IS NULL OR m.user_id = :user_id::int)
        AND (:from::timestamptz IS NULL OR m.occurred_at >= :from::timestamptz)
        AND (:to::timestamptz IS NULL OR m.occurred_at <= :to::timestamptz)
      ORDER BY m.occurred_at DESC, m.id DESC
      LIMIT :limit
      `,
      { replacements }
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error obteniendo historial" });
  }
};
