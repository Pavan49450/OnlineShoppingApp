const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const handlebars = require("express-handlebars");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/Error");
// const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const app = express();
const mongodbURI =
  // "mongodb://kattulaPavan:skyisblue@localhost:27017/?authMechanism=DEFAULT";
  "mongodb+srv://pavan49450:1234567890@cluster0.pmgc3gi.mongodb.net/shop?retryWrites=true&w=majority";

const store = MongoDbStore({
  uri: mongodbURI,
  collection: "sessions",
});
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  // console.log(req.session.user._id);
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    User.findOne().then((user) => {
      // console.log("user->", user);
      if (!user) {
        const newUser = new User({
          name: "Pavan",
          email: "pavan49450@gmail.com",
          cart: {
            items: [],
            totalPrice: 0,
          },
        });
        newUser.save();
      }
    });
    console.log("Connected!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
