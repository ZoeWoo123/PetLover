var candidates = require("../models/candidates");
var comments = require("../models/comments");
var middlewareObj = {};

middlewareObj.checkCandidateOwnership = function(req, res, next){
	//if user logged in -> does user own the candidate?
	//if not -> redirect
	if(req.isAuthenticated()){
		candidates.findById(req.params.id, function(err, foundCandidate){
			if(err){
				req.flash("error", "Something went wrong...");
				res.redirect("back");
			}else{
				if(foundCandidate.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "Please Login First!")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		comments.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Something went wrong...");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","You don't have permission!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "Please Login First!")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

module.exports = middlewareObj;