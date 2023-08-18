// const Product = require("../models/product");
const Product = require("../models/product");
// const Cart = require("../models/cart");
const user = require("../models/user");
const Order = require("../models/order");

module.exports.getProducts = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
  const isLoggedIn = req.session.isLoggedIn;
  console.log("->", isLoggedIn);
  console.log("user", req.user);
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        docTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
  // console.log("user->", req.user);
  // console.log("req->", req);
  req.user.populate("cart.items.productId").then((user) => {
    // console.log(user);
    const products = user.cart.items;
    const totalPrice = user.cart.totalPrice;
    res.render("shop/cart", {
      path: "/cart",
      docTitle: "Cart Items",
      cart: products,
      totalPrice: totalPrice.toFixed(2),
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  const addMode = true;
  Product.findById(prodId)
    .then((product) => {
      console.log("cart->", product);
      return req.user.addToCart(product, addMode);
    })
    .then((result) => {
      res.redirect("/cart");
      // console.log(result);
    })
    .catch((err) => console.log(err));
};

exports.postRemoveProductFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  const addMode = false;
  Product.findById(prodId)
    .then((product) => {
      // console.log(product);
      return req.user.addToCart(product, addMode);
    })
    .then((result) => {
      res.redirect("/cart");
      // console.log(result);
    })
    .catch((err) => console.log(err));
};

exports.postDeleteItemInCart = (req, res, next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  req.user
    .deleteCartItem(prodId, prodPrice)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.getOrders = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
  Order.find()
    .populate()
    .then((orders) => {
      const products = orders[0].products;
      const totalPrice = orders[0].totalPrice;

      res.render("shop/orders", {
        docTitle: "Orders",
        path: "/orders",
        products: products,
        totalPrice: totalPrice.toFixed(2),
        isAuthenticated: req.session.isLoggedIn,
      });
    });
};

exports.postOrders = (req, res, next) => {
  req.session.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((p) => {
        return { product: { ...p.productId._doc }, quantity: p.quantity };
      });
      const userDetails = {
        name: req.session.user.name,
        userId: req.session.user._id,
      };
      const totalPrice = user.cart.totalPrice;

      const order = new Order({
        products: products,
        totalPrice: totalPrice,
        user: userDetails,
      });
      return order.save();
    })
    .then((result) => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};
