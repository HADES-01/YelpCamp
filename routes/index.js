let express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/Users"),
    middleware = require("../middleware");

router.get("/register", function (req, res) {
    res.render("auth/register");
});

router.post("/register", function (req, res) {
    let newUser = new User({
        name: req.body.user.name,
        username: req.body.username,
        avatar: req.body.user.avatar,
        contact: req.body.user.contact,
        phone: req.body.user.phone,
    });
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            req.flash("error", err.message);
            res.render("auth/register");
        } else {    
            passport.authenticate('local')(req, res, function () {
                req.flash("success", "Welcome to Yelp Camp! " + user.username)
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function (req, res) {
    res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}),function (req, res) {});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/campgrounds");
});
module.exports = router;