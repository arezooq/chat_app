export default function checkAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
}