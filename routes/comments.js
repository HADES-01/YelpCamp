let express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment = require("../models/comments"),
    User = require("../models/Users"),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

router.post("/", middleware.isLoggedIn, middleware.hasCommented, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if(err){
            console.log(err);
            req.flash("error", "Server under maintenance");
            res.redirect("/campgrounds/")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username  = req.user.username;
                    comment.author.avatar = req.user.avatar;
                    comment.campground = req.params.id;
                    comment.campgroundName = foundCampground.name;
                    comment.rating = req.body.rating;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    User.findById(req.user.id, function (err, user) {
                        if(err){
                            console.log(err);
                        } else {
                            user.comments.push(comment);
                            user.save();
                            req.flash("success", "Successfully added comment");
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

router.get("/:commentId/like", middleware.isLoggedIn, middleware.hasLiked, function (req, res) {
    Comment.findById(req.params.commentId, function (err, comment) {
        if(err){
            console.log(err);
        } else {
            User.findById(req.user.id, function (err, user) {
                if(err){
                    console.log(err);
                    req.flash("error", "Didn't Work.")
                    res.redirect("back");
                } else{
                    user.likedComments.push(req.params.commentId);
                    user.save();
                    comment.likes += 1;
                    comment.save();
                    res.redirect("back");
                }
            });
        }
    });
});

router.get("/:commentId/dislike", middleware.isLoggedIn, middleware.hasDisliked, function (req, res) {
    Comment.findById(req.params.commentId, function (err, comment) {
        if(err){
            console.log(err);
        } else {
            User.findById(req.user._id, function (err, user) {
                if(err){
                    console.log(err);
                    req.flash("error", "Didn't Work.")
                    res.redirect("back");
                } else{
                    user.dislikedComments.push(req.params.commentId);
                    user.save();
                    comment.dislikes += 1;
                    comment.save();
                    res.redirect("back");
                }
            });
        }
    });
});

router.put("/:commentId/", middleware.checkCommentOwner, function (req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment , function (err, comment) {
        req.flash("success", "Successfully Edited Your Comment ");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

router.delete("/:commentId", middleware.checkCommentOwner, function (req, res) {
    Comment.findByIdAndDelete(req.params.commentId, {useFindAndModify: false},function (err, foundCampground) {
        if(err){
            console.log(err);
        } else {
            Campground.findByIdAndUpdate(
                req.params.id,
                { $pull: { comments: { $in: [req.params.commentId] } } },
                function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        User.findByIdAndUpdate(req.user.id, { $pull: { comments: { $in: [req.params.commentId] } } }, function(err) {});
                        User.findByIdAndUpdate(req.user.id, { $pull: { likedComments: { $in: [req.params.commentId] } } }, function(err) {});
                        User.findByIdAndUpdate(req.user.id, { $pull: { dislikedComments: { $in: [req.params.commentId] } } }, function(err) {});
                    }
                }
            );
            req.flash("success", "Deleted the Comment Successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;