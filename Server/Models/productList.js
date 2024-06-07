const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productListSchema = new Schema(
    {
        reservedProductIds : [{
            type: Schema.Types.ObjectId,
            ref: 'ReservedProduct',
            required: true
        }],
    },
    {timestamps : true}
);

module.exports = mongoose.model('ProductList', productListSchema);