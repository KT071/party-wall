const Food = require("../models/FoodModel");
const Drink = require("../models/DrinkModel");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

/**
 * Items List.
 *
 * @returns {Object}
 */
exports.itemList = [
    auth,
    async function (req, res) {
        try {
            const food = await Food.find();
            const drink = await Drink.find();
            const items = new Set([...food, ...drink]);

            return apiResponse.successResponseWithData(res, "Operation success", [...items]);
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];
