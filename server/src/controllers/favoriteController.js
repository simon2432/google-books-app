const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addFavorite = async (req, res) => {
  const { title, author, description, imageUrl } = req.body;
  try {
    const existing = await prisma.libro.findFirst({
      where: {
        usuarioId: req.user.id,
        title: title,
      },
    });

    if (existing) {
      return res
        .status(200)
        .json({ message: "Libro ya guardado", book: existing });
    }

    const book = await prisma.libro.create({
      data: {
        title,
        author,
        description,
        imageUrl,
        usuario: { connect: { id: req.user.id } },
      },
    });

    res.status(201).json({ message: "Libro guardado", book });
  } catch (err) {
    console.error("ERROR GUARDAR FAVORITO:", err);
    res.status(500).json({ error: "Error al guardar libro" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await prisma.libro.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites);
  } catch (err) {
    console.error("ERROR OBTENER FAVORITOS:", err);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};

exports.deleteFavorite = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.libro.findFirst({
      where: {
        id: Number(id),
        usuarioId: req.user.id, // Validamos que sea del usuario autenticado
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await prisma.libro.delete({
      where: { id: book.id },
    });

    res.json({ message: "Libro eliminado" });
  } catch (err) {
    console.error("ERROR ELIMINAR FAVORITO:", err);
    res.status(500).json({ error: "Error al eliminar libro" });
  }
};
