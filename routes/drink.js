const express = require("express");
const DrinkController = require("../controllers/DrinkController");

const router = express.Router();

router.post("/", DrinkController.foodStore);
router.delete("/:id", DrinkController.foodDelete);

module.exports = router;