const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservedProductSchema = new Schema(
    {
        productId : {
            type : Schema.Types.ObjectId,
            ref : "Product",
            required : [true, "The Id of the associated id is required"]
        },
        quantity : {
            type : Number,
            required: [true, "The reserved product requires a quantity"],
            validate: {
                validator : function (value) {
                    return value > 0
                },
                message: "Le prix de la facture doit être suppérieur à 0"
            }
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model("ReservedProduct", reservedProductSchema);