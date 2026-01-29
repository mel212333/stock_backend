const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const ctrl = require("../controllers/products.controller");

// todos autenticados pueden ver
router.get("/", auth, ctrl.list);

// solo ADMIN puede crear (si querés, lo abrimos a OPERADOR)
router.post("/", auth, role("ADMIN"), ctrl.create);

module.exports = router;
