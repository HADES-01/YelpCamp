let express     = require("express")
    ,app        = express()
    ,mongoose   = require("mongoose")
    ,bodyparser = require("body-parser")
    ,request    = require("requests")
    ,Campground = require("./models/campgrounds.js")
    ,Comment    = require("./models/comments")
    ,methodOverride = require("method-override")
    ,passport   = require("passport")
    ,LocalStrategy = require("passport-local")
    ,User       = require("./models/Users")
    ,flash = require("connect-flash");

let campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    userRoutes       = require("./routes/users")
    authRoutes       = require("./routes/index");

app.use(flash());
app.use(require("express-session")({
    secret: "Aditya is the Best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser((User.deserializeUser()));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({extended : true}));
app.locals.moment = require("moment");
mongoose.connect(
    "mongodb+srv://aditya:1eNjpJBKt8Z771gN@yelpcamp.u5orm.gcp.mongodb.net/yelpcamp?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
// seedDb();
app.get("/", function (req, res) {
    res.render("home");
});

app.use("/campgrounds",campgroundRoutes);
app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/user/", userRoutes);
app.use("/about", function (req,res) {
    res.render("about");
});
app.use("*", function (req, res) {
    res.render("error404");
});
app.listen("3000", function () {
    console.log("App is Started at Port 3000");
});