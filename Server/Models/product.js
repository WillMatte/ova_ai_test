const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        name : {
            type : String,
            minLength : [1, "The name of the product need to be at least 1 character"],
            maxLength : [255, "The name of the product can't exceed 255 characters"],
            required : [true, "The name of the product is required"]
        },
        price : {
            type : Number,
            required: [true, "The price of the product is required"],
            validate: {
                validator : function (value) {
                    return value > 0;
                },
                message: "The price of the product has to be higher than 0"
            }
        },
        availableQuantity : {
            type : Number,
            required : [true , "The products needs an available quantity"],
            validate: {
                validator : function (value) {
                    return value >= 0
                },
                message: "The product can't have a negative number of available quantity"
            }
        }
    },
    {timestamps : true}
)

module.exports = mongoose.model('Product', productSchema);