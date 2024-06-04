const Product = require("../Models/product");

exports.Add = async (req, res, next) => {
    const {name, price, availableQuantity} = req.body
    try {
        const product = new Product({
            name : name,
            price : price,
            availableQuantity : availableQuantity
        });
        const result = await product.save()
        return res.status(200).json({message : "Product added with success"})
    }catch (e) {
        next(e)
    }
}

exports.ReadOne = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = Product.findById(productId);
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