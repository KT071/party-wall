const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    weight: {type: Number, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Food", FoodSchema);