require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada");

    app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    process.exit(1);
  }
})();
