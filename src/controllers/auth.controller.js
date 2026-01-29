const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "full_name, email y password son requeridos" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: "El email ya existe" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password_hash: hash,
      role: role || "OPERADOR",
      active: true,
    });

    return res.status(201).json({
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creando usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email y password requeridos" });

    const user = await User.findOne({ where: { email } });
    if (!user || !user.active) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken(user);

    return res.json({
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error en login" });
  }
};

exports.me = async (req, res) => {
  return res.json({ user: req.user });
};
