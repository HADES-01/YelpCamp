let mongoose = require("mongoose");
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: [
        {
            type: String,
            default: "https://umkarsingh.com/wp-content/uploads/2018/10/No-image-available.jpg"
        }
    ],
    description: String,
    author:{
        type: mongoose.Schema.Types.ObjectID,
        ref: "User"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created: {
        type: Date,
        default: Date.now()
    },
    address: String,
    bookingStart: {
        type: Date,
        default: Date.now()
    },
    bookingEnd: {
        type: Date,
        default: Date.now()
    },
    rating: Number,
    price: {
        type: Number,
        default: 10
    }
});
let Campground = mongoose.model(
    "Campground",
    campgroundSchema
);
module.exports = Campground;