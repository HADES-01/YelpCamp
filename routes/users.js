let express = require("express"),
    router  = express.Router(),
    middleware = require("../middleware"),
    User    = require("../models/Users");

router.get("/:id" , function(req, res) {
   User.findById(req.params.id).populate("campgrounds comments").exec( function (err, foundUser) {
       if(err){
           console.log("error");
           req.flash("error", "User doesn't Exist.");
           res.redirect("back");
       } else {
           res.render("profiles/index", {user: foundUser});
       }
   });
});

router.get("/:id/edit", middleware.checkProfileOwner, function(req, res){
   User.findById(req.params.id, function (err, foundUser) {
       if(err){
           console.log("error");
           req.flash("error", "User doesn't Exist.");
           res.redirect("back");
       } else {
           res.render("profiles/edit", {user: foundUser});
       }
   });
});

router.put("/:id", middleware.checkProfileOwner,function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, user) {
        if(err){
            console.log("error");
            req.flash("error", "User doesn't Exist.");
            res.redirect("back");
        }
        res.redirect("/user/" + req.params.id);
    });
});

module.exports = router;