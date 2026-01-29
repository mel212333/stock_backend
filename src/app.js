const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const stockRoutes = require("./routes/stock.routes");
const sectorsRoutes = require("./routes/sectors.routes");
const requestersRoutes = require("./routes/requesters.routes");


const app = express();
console.log("authRoutes:", typeof authRoutes);
console.log("productsRoutes:", typeof productsRoutes);
console.log("stockRoutes:", typeof stockRoutes);

app.use(cors());
app.use(express.json());
app.use("/api/sectors", sectorsRoutes);
app.use("/api/requesters", requestersRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/stock", stockRoutes);

module.exports = app;
