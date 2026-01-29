const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const ctrl = require("../controllers/requesters.controller");

router.get("/", auth, ctrl.list);
router.post("/", auth, role("ADMIN"), ctrl.create);

module.exports = router;
