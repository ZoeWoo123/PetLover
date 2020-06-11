//==============
//COMMENT ROUTES
//==============
var express = require("express"),
	router = express.Router({mergeParams: true});
	candidates = require("../models/candidates"),
	comments = require("../models/comments"),
	middlewareObj = require("../middleware");

//Comments New
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	//find candidate by id
	candidates.findById(req.params.id, function(err, candidate){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {candidate:candidate});
		}
	});
	
});

//Comments Create
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	//lookup candidate using ID
	candidates.findById(req.params.id, function(err, candidate){
		if(err){
			console.log(err);
			res.redirect("/candidates");
		}else{
			//create new comments
			comments.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect new comment to candidate
					candidate.comments.push(comment);
					candidate.save();
					//redirect candidate show page
					req.flash("success", "Add Comment Success!");
					res.redirect("/candidates/"+candidate._id);
				}
			})
			
		}
	})
	
});

//DESTORY
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	comments.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}else{
			req.flash("success", "Delete Success!");
			res.redirect("/candidates/" + req.params.id);
		}
	});
});

module.exports = router;