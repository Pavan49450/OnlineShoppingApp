const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const adminData = require("./admin");
const shopControllers = require("../controllers/shop");
const router = express.Router();

router.get("/", shopControllers.getIndex);
router.get("/products", shopControllers.getProducts);
router.get("/products/:productId", shopControllers.getProduct);
router.get("/cart", shopControllers.getCart);
router.post("/cart", shopControllers.postCart);
router.post(
  "/removeProductFromCart",
  shopControllers.postRemoveProductFromCart
);
router.post("/deleteItemInCart", shopControllers.postDeleteItemInCart);
router.get("/orders", shopControllers.getOrders);
router.post("/orders", shopControllers.postOrders);
router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
