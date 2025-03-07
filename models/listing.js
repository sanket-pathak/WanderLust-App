const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const link = "";
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required:true },
    image: {
        url: { type: String, default: "default_image" },
        filename: { type: String, default: "default.jpg" },
    },
    price: { type: Number, required: true },
    location: { type: String, default: "Unknown Location" },
    country: { type: String, default: "Unknown Country" },
});

module.exports = mongoose.model("Listing", listingSchema);


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;