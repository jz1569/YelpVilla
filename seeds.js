var mongoose = require("mongoose");
var Villa = require("./models/villa");
var Comment = require("./models/comment");

var data = [
    {
        name: "Overwater Villa with Private Pool",
        image: "http://53e6e95fa523edc2d249-64fa9f17c0c3e4bc94cfcf8d5ecfdcff.r59.cf1.rackcdn.com/responsive/790:492/53e6e95fa523edc2d249-64fa9f17c0c3e4bc94cfcf8d5ecfdcff.r59.cf1.rackcdn.com/XLGallery/Over-Water-Villa.jpg",
        description: "Tranquilize in the comfort of the Over Water Villa right in the heart of Vommuli Island, Maldives. Step out onto the expansive, private outdoor terrace to unveil the bungalow’s 17 – square meter private pool, plush daybed, sun loungers, and four overwater hammocks that offer direct access to the unforgettable azure waters of the Indian Ocean."
    },
    {
        name: "Villa Langka",
        image: "http://villalangka.com/wp-content/uploads/2015/08/Villa-des-palm.jpg",
        description: "in the forest"
    },
    {
        name: "Villa Cortez",
        image: "https://www.oneandonlyresorts.com/-/media/oneandonly/palmilla/accommodations/landing/villa-cortez/1440x900/villa-cortez-outside.jpg?v1",
        description: "Exceptional luxury and blissful serenity, with breathtaking sea views and all the gracious hospitality of Mexico."
    }
]

function seedDB() {
    //Remove all villas
    Villa.remove({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("removed villas!");
        Comment.remove({}, function(err){
            if (err) {
                console.log(err);
            }
            console.log("remove comments!");
            //add a few villas
            data.forEach(function(seed){
                Villa.create(seed, function(err, villa){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a villa");
                        //add a few comments
                        Comment.create(
                            {
                                text: "This place is greate, but I wish there was internet",
                                author: "Homer"
                                
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    villa.comments.push(comment);
                                    villa.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
}

module.exports = seedDB;