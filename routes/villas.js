var express = require("express");
var router = express.Router();
var Villa = require("../models/villa");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//Index - show all villas
router.get("/", function(req, res){
    //get all villas from DB
    Villa.find({}, function(err, allVillas){
        if (err) {
            console.log(err);
        } else {
            res.render("villas/index", {villas: allVillas, page: 'villas'});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to villas array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newVilla = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new villa and save to DB
    Villa.create(newVilla, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to villas page
            console.log(newlyCreated);
            res.redirect("/villas");
        }
    });
  });
});

//new - show form to create new villa
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("villas/new");
});

//show - shows more info about one villa
router.get("/:id", function(req, res) {
    //find the villa with provided ID
    Villa.findById(req.params.id).populate("comments").exec(function(err, foundVilla){
        if(err || !foundVilla) {
            req.flash("error", "Villa not found");
            res.redirect("back");
        } else {
            console.log(foundVilla);
            //render show template with that villa
            res.render("villas/show", {villa: foundVilla});
        }
    });
});

//edit villa route
router.get("/:id/edit", middleware.checkVillaOwnership, function(req, res) {
    Villa.findById(req.params.id, function(err, foundVilla) {

        res.render("villas/edit", {villa: foundVilla});
    });
});

// UPDATE villa ROUTE
router.put("/:id", middleware.checkVillaOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.villa.lat = data[0].latitude;
        req.body.villa.lng = data[0].longitude;
        req.body.villa.location = data[0].formattedAddress;
    
        Villa.findByIdAndUpdate(req.params.id, req.body.villa, function(err, villa){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/villas/" + villa._id);
            }
        });
    });
});

//destroy villa route
router.delete("/:id", middleware.checkVillaOwnership, function(req, res){
    Villa.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/villas");
        } else {
            res.redirect("/villas");
        }
    });
});


module.exports = router;