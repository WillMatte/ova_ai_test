const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productListSchema = new Schema(
    {
        reservedProductIds : [{
            type: Schema.Types.ObjectId,
            ref: 'ReservedProduct',
            required: true
        }],
        totalPrice : {
            type: Number,
            required: [true, "The product list needs to have a total price"],
            validate: {
                validator: function (value) {
                    return value > 0
                },
                message : "The total price can't be under 0"
            }
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model('ProductList', productListSchema);