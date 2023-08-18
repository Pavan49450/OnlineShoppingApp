exports.get404Page = (req, res, next) => {
  res.status(404).render("404", {
    docTitle: "Error Page",
    path: undefined,
    isAuthenticated: req.session.isLoggedIn,
  });
};
