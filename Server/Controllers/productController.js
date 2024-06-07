const Product = require("../Models/product");

exports.Add = async (req, res, next) => {

    const {name, price, availableQuantity} = req.body
    try {
        if (!name || name.trim().length === 0){
            const err = new Error("The product needs a name")
            err.statusCode = 401
            throw err
        }
        if (name.length > 255){
            const err = new Error("The name of the product can't exceed 255 characters")
            err.statusCode = 401
            throw err
        }
        if (!price || price <= 0){
            const err = new Error("The price of the product has to be a whole positive number")
            err.statusCode = 401
            throw err
        }
        if (!availableQuantity || availableQuantity < 0){
            const err = new Error("The quantity of the product can't be negative")
            err.statusCode = 401
            throw err
        }
        const product = new Product({
            name : name,
            price : price,
            availableQuantity : availableQuantity
        });
        await product.save()
        return res.status(200).json({message : "Product added with success"})
    }catch (e) {
        next(e)
    }
}

exports.ReadOne = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product){
            const err = new Error("The product doesn't exist");
            err.statusCode = 404;
            throw err;
        }
        return res.status(200).json({product : product});
    }catch (e) {
        next(e)
    }
}

exports.ReadAll = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({products : products});
    }catch (e){
        next(e)
    }
}

exports.DeleteOne = async  (req, res, next) => {
    
}