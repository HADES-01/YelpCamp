let passportLocalMongoose = require("passport-local-mongoose"),
    mongoose              = require("mongoose");

let userSchema = mongoose.Schema({
    name: String,
    username: String,
    avatar:String,
    contact: String,
    phone: String,
    password: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Comment"
        }
    ],
    campgrounds: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Campground"
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    },
    likedComments: [
        {
            type: String
        }
    ],
    dislikedComments: [
        {
            type: String
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);