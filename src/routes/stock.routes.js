const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const ctrl = require("../controllers/stock.controller");

router.get("/", auth, ctrl.current);           // stock actual
router.get("/moves", auth, ctrl.history);      // historial
router.post("/moves", auth, ctrl.createMove);  // crear movimiento

module.exports = router;
