const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addproduct(id, productPrice, addMode) {
    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analayze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      console.log("existingProduct", existingProduct);
      let updatedProduct;
      if (existingProduct && addMode) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        // cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct;
        cart.totalPrice = cart.totalPrice + Number(productPrice);
      } else if (!addMode && existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty - 1;
        // cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct;
        cart.totalPrice = cart.totalPrice - Number(productPrice);

        if (updatedProduct.qty === 0) {
          this.deleteProduct(updatedProduct.id, productPrice);
        }
      } else {
        updatedProduct = {
          id: id,
          qty: 1,
        };
        cart.products = [...cart.products, updatedProduct];
        cart.totalPrice = cart.totalPrice + Number(productPrice);
      }
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    // Add new product /increase quantity
  }

  static deleteProduct(id, price) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((p) => p.id === id);
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - price * product.qty;
      if (product.qty === 0) {
        console.log("Here");
      }
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getCartProduct(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
