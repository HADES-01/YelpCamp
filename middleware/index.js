var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var User = require("../models/Users");
let middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).populate("author").exec(function (err, foundCampground) {
            if(err) {
                req.flash("error", "Server under maintenance")
                res.redirect("/campgrounds");
            } else {
                if(foundCampground.author._id.equals(req.user.id)){
                    next();
                } else {
                    req.flash("error", "You don't have the required permission.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged in");
        res.redirect("/login");
    }
}

middlewareObj.hasCommented = function(req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.user.id).populate("comments").exec(function (err, user) {
            if(user.comments.length > 0){
                if(checkComments(user, req.params.id)){
                    req.flash("error", "You have already Commented, Go and Edit");
                    res.redirect("/campgrounds/" + req.params.id);
                } else {
                    next();
                }
            } else {
                next();
            }
        });
    } else {
        req.flash("error", "You need to be Logged in");
        res.redirect("back");
    }
}

middlewareObj.hasLiked = function(req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.likedComments.includes(req.params.commentId)){
            User.findByIdAndUpdate(req.user.id, { $pull : { likedComments: { $in : [req.params.commentId] } } }, function (err) {});
            Comment.findById(req.params.commentId, function (err, comment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    comment.likes -= 1;
                    comment.save();
                    res.redirect("back");
                }
            });
        } else {
            next();
        }
    } else {
        req.flash("error", "You need to be Logged in");
        res.redirect("back");
    }
}

middlewareObj.hasDisliked = function(req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.dislikedComments.includes(req.params.commentId)){
            User.findByIdAndUpdate(req.user.id, { $pull : { dislikedComments: { $in : [req.params.commentId] } } }, function (err) {});
            Comment.findById(req.params.commentId, function (err, comment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    comment.dislikes -= 1;
                    comment.save();
                    res.redirect("back");
                }
            });
        } else {
            next();
        }
    } else {
        req.flash("error", "You need to be Logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId).populate("author").exec( function (err, comment) {
            if (err){
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("You don't have the required permission.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be Logged in");
        res.redirect("/login")
    }
}
middlewareObj.checkProfileOwner = function(req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.params.id, function (err, user) {
            if (err){
                res.redirect("back");
            } else {
                if (user._id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("You don't have the required permission.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be Logged in");
        res.redirect("/login")
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be Logged in.")
        res.redirect("/login");
    }
}

function checkComments(user, id){
    for(let i = 0; i < user.comments.length; i++) {
        if (String(user.comments[i].campground) === String(id)) {
            return true;
        }
    }
    return false;
}

module.exports = middlewareObj;