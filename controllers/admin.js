const { ObjectId } = require("mongodb");
const Product = require("../models/product");
const objectId = require("mongodb").ObjectId;

module.exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-products",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports.postAddProducts = (req, res, next) => {
  console.log(req);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

module.exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      // console.log("product->", product);
      if (!product) {
        return res.redirect("/");
      } else {
        res.render("admin/edit-product", {
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: editMode,
          product: product,
          isAuthenticated: req.session.isLoggedIn,
        });
      }
    })
    .catch((err) => console.log(err));
};

module.exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("Updated!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];

  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then((result) => {
      console.log("Deleted! ", prodId);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
