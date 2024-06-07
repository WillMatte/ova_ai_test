const Product = require("../Models/product");
const ReservedProduct = require("../Models/reservedProduct");
const ProductList = require("../Models/productList");

const products = require("../Seeds/product")
const reservedProducts = require("../Seeds/reservedProduct")
const productList = require("../Seeds/productList")
exports.Seed = async (req,res,next) => {
    const result = {};
    try {
        await Promise.all([
            Product.deleteMany(),
            ReservedProduct.deleteMany(),
            ProductList.deleteMany()
        ])       
        
        const [productInsert, reservedProductInsert, ProductListInsert] = await Promise.all([
            Product.insertMany(products),
            ReservedProduct.insertMany(reservedProducts),
            ProductList.insertMany(productList)
        ])
        
        if (productInsert.length > 0){
            result.products = productInsert;
        }
        if (reservedProductInsert.length > 0){
            result.products = productInsert;
        }
        if (ProductListInsert.length > 0){
            result.products = productInsert;
        }
        res.status(200).json(result)
    }catch (e) {
        if (!e.statusCode)
            e.statusCode = 500;
        next(e)
    }
}