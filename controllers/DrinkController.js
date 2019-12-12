const Drink = require("../models/DrinkModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");

function DrinkData(data) {
    this.id = data._id;
    this.name= data.name;
    this.volume = data.volume;
    this.price = data.price;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt;
}

/**
 * Drink store.
 *
 * @param {string}      name
 * @param {number}      volume
 * @param {number}      price
 * @param {number}      quantity
 *
 * @returns {Object}
 */
exports.foodStore = [
    auth,
    body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
    body("volume", "Volume must not be empty").isDecimal().trim(),
    body("price", "Price must not be empty").isDecimal().trim(),
    body("quantity", "Quantity must not be empty").isDecimal().trim(),
    sanitizeBody("*").escape(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            const food = new Drink({
                user: req.user,
                name: req.body.name,
                volume: req.body.volume,
                price: req.body.price,
                quantity: req.body.quantity
            });

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                food.save(function (err) {
                    if (err) { return apiResponse.ErrorResponse(res, err); }
                    let foodData = new DrinkData(food);
                    return apiResponse.successResponseWithData(res,"Drink add Success.", foodData);
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * Drink Delete.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.foodDelete = [
    auth,
    function (req, res) {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
        }
        try {
            Drink.findById(req.params.id, function (err, foundDrink) {
                if(foundDrink === null){
                    return apiResponse.notFoundResponse(res,"Drink not exists with this id");
                }else{
                    if(foundDrink.user.toString() !== req.user._id){
                        return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
                    }else{
                        Drink.findByIdAndRemove(req.params.id,function (err) {
                            if (err) {
                                return apiResponse.ErrorResponse(res, err);
                            }else{
                                return apiResponse.successResponse(res,"Drink delete Success.");
                            }
                        });
                    }
                }
            });
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];