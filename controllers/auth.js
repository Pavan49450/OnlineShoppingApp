const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
  const isLoggedIn = req.session.isLoggedIn;
  console.log(isLoggedIn);
  res.render("auth/login", {
    docTitle: "Login Page",
    path: "/login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("64bf7d30e29c5b7775e8afee")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
