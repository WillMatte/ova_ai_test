const Product = require("../Models/product");
const ProductList = require("../Models/productList");
const ReservedProduct = require("../Models/reservedProduct");

exports.ReadOne = async (req,res,next) => {
    //for simplicity, the bd will only contain 1 productlist
    //Real world application would have to find the list(s) associated to a user
    try {
        const productList = await ProductList.findOne({})
            .populate({
                path: 'reservedProductIds',
                populate: {
                    path: 'productId',
                    model: 'Product'
                }
            });
        return res.status(200).json({productList : productList});
    }catch (e) {
        next(e)
    }
};

exports.AddItem = async (req,res,next) => {
    //TODO : Add a check to see if the product is already in the list
    const productToAdd = req.body;
    try {
        const product = await Product.findById(productToAdd.productId);
        if (!product){
            const error = new Error("The product doesn't exist")
            error.statusCode = 404;
            throw error;
        }
        if (product.availableQuantity < productToAdd.productSelectedQuantity){
            const error = new Error("The product doesn't have enough quantity in stock")
            error.statusCode = 401;
            throw error;
        }
        let reservedProduct = new ReservedProduct({
            productId : product._id,
            quantity : productToAdd.productSelectedQuantity
        });
        reservedProduct = await reservedProduct.save();
        product.availableQuantity -= reservedProduct.quantity;
        await product.save();
        const productList = await ProductList.findOne({});
        productList.reservedProductIds.push(reservedProduct._id);
        await productList.save();
        return res.status(200).json({message:"Item added with success"}).send();
    }catch (e) {
        next(e)
    }
};

exports.RemoveItem = async (req,res,next) => {
    const productToRemove = req.body
    try {
        const productList = await ProductList.findOne({});
        const reservedProduct = await ReservedProduct.findById(productToRemove.productToRemoveId)
        if (!reservedProduct){
            const err = new Error("The reservation of the product does not exist")
            err.statusCode = 401
            throw err;
        }
        if (!productList.reservedProductIds.some(item => item._id.equals(reservedProduct._id))) {
            const err = new Error("The reserved product is not in the list");
            err.statusCode = 404;
            throw err;
        }
        const product = await Product.findById(reservedProduct.productId);
        product.availableQuantity += reservedProduct.quantity;
        await product.save();
        await ReservedProduct.findByIdAndDelete(reservedProduct._id);
        productList.reservedProductIds.pull(reservedProduct._id);
        await productList.save();
        return res.status(200).json({message: "Product removed from list with success"}).send();
    }catch (e) {
        next(e)
    }
};

exports.ClearList = async (req,res,next) => {
    try {
        const productList = await ProductList.findOne({}).populate("reservedProductIds");
        if (!productList) {
            const err = new Error("Product list not found");
            err.statusCode = 404;
            throw err;
        }
        for (const reservedProduct of productList.reservedProductIds) {
            const product = await Product.findById(reservedProduct.productId);
            product.availableQuantity += reservedProduct.quantity;
            await product.save();
        }
        await ReservedProduct.deleteMany({ _id: { $in: productList.reservedProductIds } });
        productList.reservedProductIds = [];
        await productList.save();
        return res.status(200).json({message : "List Cleared with success"}).send();
    }catch (e) {
        next(e)
    }
};

