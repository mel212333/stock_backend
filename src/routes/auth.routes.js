const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const ctrl = require("../controllers/auth.controller");

// Para arrancar: register protegido para ADMIN.
// (Para crear el primer admin, abajo te doy 2 opciones)
router.post("/register", auth, role("ADMIN"), ctrl.register);

router.post("/login", ctrl.login);
router.get("/me", auth, ctrl.me);

module.exports = router;
