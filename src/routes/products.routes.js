const router = require("express").Router();
const auth = require("../middlewares/auth");
const products = require("../controllers/products.controller");

// lista y crear
router.get("/", auth, products.list);
router.post("/", auth, products.create);

// editar y desactivar
router.put("/:id", auth, products.update);
router.delete("/:id", auth, products.remove);

module.exports = router;
