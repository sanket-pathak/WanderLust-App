const express = require('express');
const app = express();
const serverless = require('serverless-http');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
const Listing = require("./models/listing");
const path = require("path");
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use('/static', express.static(path.join(__dirname, 'public')))


app.listen(8080, () => {
    console.log("Listening on port 8080");
});


//ejs mate templating
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);


app.get("/", (req, res)=>{
    console.log("Hi I'm root");
})

async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
.then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

// app.get("/testListing", async(req, res)=>{
//     let sampleListing = new Listing({
//         title: "My Home",
//         description: "By the road",
//         image: {
//             url:"",
//             filename: "",
//         },
//         price: "1200",
//         location: "calangute",
//         country: "India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Succesful testing");
// });



app.get("/listings",async (req, res)=>{
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("./listings/index.ejs", {allListings});
}); 

//newPost route
app.get("/listings/newPost", (req, res)=>{
    res.render("./listings/newPost.ejs");
});

//for create
app.post("/listings", async (req, res) => {
    try {
        const { listing } = req.body;

        const newListing = new Listing({
            title: listing.title,
            description: listing.description,
            image: {
                url: listing.image.url || "/static/default-image.jpg",
                filename: listing.image.url?.split('/').pop() || "default.jpg",
            },
            price: Number(listing.price) && Number(listing.price)>0,
            location: listing.location,
            country: listing.country,
        });

        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("An error occurred while creating the listing.");
    }
});



app.get("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let item = await Listing.findById(id);
        console.log("Retrieved Item:", item); // Log the full item for debugging
        res.render("./listings/show.ejs", { item });
    } catch (err) {
        console.error("Error fetching item:", err);
        res.status(500).send("An error occurred while retrieving the listing.");
    }
});

app.get("/listings/:id/edit",async (req, res)=>{
    let {id} = req.params;
    //find out listing
    const listing = await Listing.findById(id);
    res.render("./listings/editPost.ejs", {listing});
});

//put request
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//DELETE ROUTE
app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
