let mongoose    = require("mongoose");

let commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User"
        },
        username: String,
        avatar: String
    },
    campground: String,
    campgroundName: String,
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Comment", commentSchema);