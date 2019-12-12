const express = require("express");
const FoodController = require("../controllers/FoodController");

const router = express.Router();

router.post("/", FoodController.foodStore);
router.delete("/:id", FoodController.foodDelete);

module.exports = router;