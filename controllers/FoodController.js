const Food = require("../models/FoodModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");

function FoodData(data) {
    this.id = data._id;
    this.name= data.name;
    this.description = data.description;
    this.weight = data.weight;
    this.price = data.price;
    this.quantity = data.quantity;
    this.createdAt = data.createdAt;
}

/**
 * Food store.
 *
 * @param {string}      name
 * @param {string}      description
 * @param {number}      weight
 * @param {number}      price
 * @param {number}      quantity
 *
 * @returns {Object}
 */
exports.foodStore = [
    auth,
    body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
    body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
    body("weight", "Weight must not be empty").isDecimal().trim(),
    body("price", "Price must not be empty").isDecimal().trim(),
    body("quantity", "Quantity must not be empty").isDecimal().trim(),
    sanitizeBody("*").escape(),
    (req, res) => {
        try {
            const errors = validationResult(req);
            const food = new Food({
                    user: req.user,
                    name: req.body.name,
                    description: req.body.description,
                    weight: req.body.weight,
                    price: req.body.price,
                    quantity: req.body.quantity
                });

            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            }
            else {
                food.save(function (err) {
                    if (err) { return apiResponse.ErrorResponse(res, err); }
                    let foodData = new FoodData(food);
                    return apiResponse.successResponseWithData(res,"Food add Success.", foodData);
                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }
    }
];

/**
 * Food Delete.
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
            Food.findById(req.params.id, function (err, foundFood) {
                if(foundFood === null){
                    return apiResponse.notFoundResponse(res,"Food not exists with this id");
                }else{
                    if(foundFood.user.toString() !== req.user._id){
                        return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
                    }else{
                        Food.findByIdAndRemove(req.params.id,function (err) {
                            if (err) {
                                return apiResponse.ErrorResponse(res, err);
                            }else{
                                return apiResponse.successResponse(res,"Food delete Success.");
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