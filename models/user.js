const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
});

userSchema.methods.addToCart = function (product, addMode) {
  if (this.cart === null || this.cart === undefined || this.cart === "") {
    this.cart = { items: [], totalPrice: 0 };
  }
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  let updatedTotalPrice = this.cart.totalPrice;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0 && addMode) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedTotalPrice = product.price + updatedTotalPrice;

    console.log("updatedTotalPrice->", updatedTotalPrice);
  } else if (cartProductIndex >= 0 && !addMode) {
    newQuantity = this.cart.items[cartProductIndex].quantity - 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedTotalPrice = updatedTotalPrice - product.price;

    if (newQuantity <= 0) {
      const updatedCartItems = this.cart.items.filter((item) => {
        return item.productId.toString() !== product._id.toString();
      });
      this.cart = { items: updatedCartItems, totalPrice: updatedTotalPrice };
      return this.save();
    }
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
    updatedTotalPrice = product.price + updatedTotalPrice;
  }

  const updatedCart = {
    items: updatedCartItems,
    totalPrice: updatedTotalPrice,
  };
  console.log("updatedCart->", updatedCart);
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteCartItem = function (productId, prodPrice) {
  const deletedProduct = this.cart.items.find((item) => {
    return item.productId.toString() === productId.toString();
  });
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  updatedTotalPrice =
    this.cart.totalPrice - prodPrice * deletedProduct.quantity;
  this.cart.items = updatedCartItems;
  this.cart.totalPrice = updatedTotalPrice;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [], totalPrice: 0 };
  this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");

// const getDb = require("../util/database").getDb;
// const mongoConnect = require("../util/database").mongoConnect;

// const ObjectId = mongodb.ObjectId;
// module.exports = class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection("users")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection("users").insertOne(this);
//     }
//     return dbOp
//       .then((user) => {
//         // console.log(user);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product, addMode) {
//     if (this.cart === null || this.cart === undefined || this.cart === "") {
//       this.cart = { items: [] };
//     }
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     // let updatedTotalPrice = this.cart.totalPrice;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0 && addMode) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//       // updatedTotalPrice = product.price * newQuantity + updatedTotalPrice;
//     } else if (cartProductIndex >= 0 && !addMode) {
//       newQuantity = this.cart.items[cartProductIndex].quantity - 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//       if (newQuantity <= 0) {
//         const updatedCartItems = this.cart.items.filter((item) => {
//           // console.log("item->", item);
//           // console.log("remove", item._id.toString(), product._id.toString());
//           return item.productId.toString() !== product._id.toString();
//         });
//         const db = getDb();
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: updatedCartItems } } }
//           );
//       }
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: 1,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//       // totalPrice: updatedTotalPrice,
//     };
//     // console.log("updatedCart->", updatedCart);
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   gettotalPrice() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         let updatedTotalPrice = 0;
//         products.map((p) => {
//           const ItemQuantity = this.cart.items.find((i) => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity;
//           updatedTotalPrice = updatedTotalPrice + p.price * ItemQuantity;
//         });
//         return updatedTotalPrice;
//       });
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         let updatedTotalPrice = 0;
//         const cartProducts = {
//           products: products.map((p) => {
//             const ItemQuantity = this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity;
//             updatedTotalPrice = updatedTotalPrice + p.price * ItemQuantity;

//             return {
//               _id: p._id,
//               title: p.title,
//               imageUrl: p.imageUrl,
//               description: p.description,
//               price: (p.price * ItemQuantity).toFixed(2),
//               quantity: ItemQuantity,
//             };
//           }),
//           totalPrice: updatedTotalPrice.toFixed(2).toString(),
//         };
//         // db.collection("users").updateOne({
//         //   $set: { totalPrice: updatedTotalPrice },
//         // });
//         return cartProducts;
//       });
//   }

//   deleteItem(id) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item._id !== id;
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCartItems } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     const totalPrice = this.gettotalPrice();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getUserOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         // console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log("err=>", err);
//       });
//   }
// };
