let express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Campground = require("../models/campgrounds"),
    Comment = require("../models/comments"),
    User = require("../models/Users");

router.post("/", middleware.isLoggedIn, function (req,res) {
    let images = [req.body.camp.image1];
    if(req.body.camp.image2){
        images.push(req.body.camp.image2)
    }
    if(req.body.camp.image3){
        images.push(req.body.camp.image3)
    }
    let newCamp = new Campground({
        name: req.body.camp.name,
        image: images,
        description: req.body.camp.description,
        author: req.user,
        address: req.body.camp.address,
        bookingStart: req.body.camp.bookingStart,
        bookingEnd: req.body.camp.bookingEnd,
        price: req.body.camp.price
    });
    Campground.create(newCamp, function (err, campground) {
            if(err){
                console.log(err);
            } else {
                User.findById(req.user.id, function (err, user) {
                    if(err){
                        console.log(err);
                    } else {
                        user.campgrounds.push(campground);
                        user.save();
                        res.redirect("/campgrounds");
                    }
                });
            }
        }
    );
});

router.get("/", function (req,res) {
    Campground.find({}, function (err, allCampgrounds) {
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {camps: allCampgrounds})
        }
    })
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments author").exec(function (err, foundCamp) {
        if(err){
            console.log(err)
        }
        else{
            let total = 0;
            foundCamp.comments.forEach(function (comment) {
                total += comment.rating;
            });
            foundCamp.rating = Math.floor(total / foundCamp.comments.length);
            foundCamp.save();
            res.render("campgrounds/show", {campground: foundCamp});
        }
    })
});

router.get("/:id/edit", middleware.checkCampgroundOwner, function (req, res) {
    Campground.findById(req.params.id,function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/:id/", middleware.checkCampgroundOwner , function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, {useFindAndModify: false},function (err, campground) {
        if(err){
            res.redirect("/campgrounds");
        } else {
            Comment.find({campground: String(campground.id)}, function (err, comments) {
                if(err){
                    console.log(err);
                } else {
                    comments.forEach(function (comment) {
                        comment.campgroundName = req.body.camp.name;
                        comment.save();
                    });
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    })
});

router.delete("/:id", middleware.checkCampgroundOwner, function (req, res) {
    Campground.findByIdAndRemove(req.params.id,
        {useFindAndModify: false},
        function (err) {
            if (err){
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        })
});
module.exports = router;