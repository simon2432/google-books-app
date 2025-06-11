const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.guardarLibro = async (req, res) => {
  const { googleBookId, titulo, autores, imagenUrl, comentario } = req.body;

  try {
    const existente = await prisma.libroGuardado.findFirst({
      where: { usuarioId: req.user.id, googleBookId },
    });

    if (existente) {
      return res.status(200).json({ message: "Libro ya guardado", book: existente });
    }

    const nuevoLibro = await prisma.libroGuardado.create({
      data: {
        googleBookId,
        titulo,
        autores,
        imagenUrl,
        comentario,
        usuarioId: req.user.id,
      },
    });

    res.status(201).json({ message: "Libro guardado", book: nuevoLibro });
  } catch (err) {
    console.error("ERROR GUARDAR LIBRO:", err);
    res.status(500).json({ error: "Error al guardar libro" });
  }
};

exports.obtenerLibros = async (req, res) => {
  try {
    const libros = await prisma.libroGuardado.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { fechaGuardado: "desc" },
    });

    res.json(libros);
  } catch (err) {
    console.error("ERROR OBTENER LIBROS:", err);
    res.status(500).json({ error: "Error al obtener libros" });
  }
};

exports.eliminarLibro = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.libroGuardado.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Libro eliminado" });
  } catch (err) {
    console.error("ERROR ELIMINAR LIBRO:", err);
    res.status(500).json({ error: "Error al eliminar libro" });
  }
};

exports.actualizarLibro = async (req, res) => {
  const { id } = req.params;
  const { comentario } = req.body;

  try {
    const libroActualizado = await prisma.libroGuardado.update({
      where: { id: parseInt(id) },
      data: { comentario },
    });

    res.json(libroActualizado);
  } catch (err) {
    console.error("ERROR ACTUALIZAR LIBRO:", err);
    res.status(500).json({ error: "Error al actualizar libro" });
  }
};
