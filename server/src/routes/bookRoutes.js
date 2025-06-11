const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  guardarLibro,
  obtenerLibros,
  eliminarLibro,
  actualizarLibro,
} = require("../controllers/bookController");

// Rutas protegidas
router.post("/", auth, guardarLibro);
router.get("/", auth, obtenerLibros);
router.delete("/:id", auth, eliminarLibro);
router.put("/:id", auth, actualizarLibro);

module.exports = router;
