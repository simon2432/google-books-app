const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favoriteController");

router.post("/", auth, addFavorite);
router.get("/", auth, getFavorites);
router.delete("/:id", auth, deleteFavorite);

module.exports = router;
