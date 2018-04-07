var Villa = require("../models/villa");
var Comment = require("../models/comment");
//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkVillaOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Villa.findById(req.params.id, function(err, foundVilla){
            if (err || !foundVilla) {
                req.flash("error", "Villa not found");
                res.redirect("back");
            } else {
                //does user own the villa?
                if(foundVilla.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;