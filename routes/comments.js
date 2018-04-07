var express = require("express");
var router = express.Router({mergeParams: true});
var Villa = require("../models/villa");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find villa by id
    Villa.findById(req.params.id, function(err, villa){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {villa: villa});
        }
    });
});

//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup villa using ID
    Villa.findById(req.params.id, function(err, villa) {
        if (err) {
            console.log(err);
            res.redirect("/villas");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    villa.comments.push(comment);
                    villa.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/villas/" + villa._id);
                }
            });
        }
    });
});

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Villa.findById(req.params.id, function(err, foundVilla) {
        if(err || !foundVilla) {
            req.flash("error", "No villa found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {villa_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/villas/" + req.params.id);
        }
    });
});

//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/villas/" + req.params.id);
        }
    });
});


module.exports = router;