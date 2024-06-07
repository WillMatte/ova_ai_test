const express = require("express");
const router = express.Router();
const productListController = require("../Controllers/productListController")

router.get('/productList', productListController.ReadOne);
router.put('/productList/addItem', productListController.AddItem);
router.put('/productList/removeItem', productListController.RemoveItem);
router.put('/productList/clearList', productListController.ClearList);

module.exports = router;