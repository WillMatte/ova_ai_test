const express = require("express");
const router = express.Router();
const productController = require("../Controllers/productController")

router.get('/products', productController.ReadAll);
router.get('/product/:id', productController.ReadOne);
router.post('/product', productController.Add);
router.delete('/product/:id', productController.DeleteOne);
module.exports = router;