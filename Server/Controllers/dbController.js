const Product = require("../Models/product");
const ReservedProduct = require("../Models/reservedProduct");
const ProductList = require("../Models/productList");

const products = require("../Seeds/product")
exports.Seed = async (req,res,next) => {
    const result = {};
    try {
        await Promise.all([
            Product.deleteMany(),
            ReservedProduct.deleteMany(),
            ProductList.deleteMany()
        ])       
        
        const [productInsert, reservedProductInsert, ProductListInsert] = await Promise.all([
            Product.insertMany(products)
        ])
        
        if (productInsert.length > 0){
            result.products = productInsert;
        }
        
        res.status(200).json(result)
    }catch (e) {
        if (!e.statusCode)
            e.statusCode = 500;
        next(e)
    }
}