//===========
//candidates route
//======================
var express = require("express"),
	router = express.Router(),
	candidates = require("../models/candidates"),
	middleObj = require("../middleware");//will seek for index.js auto
//INDEX
router.get("/", function(req, res){
	//get data from db
	candidates.find({}, function(err, allCandidates){
		if(err){
			console.log(err);
		}else{
			res.render("candidates/index", {candidates:allCandidates})
		}
	});
});

//NEW
router.get("/new", middleObj.isLoggedIn, function(req, res){
	res.render("candidates/new");
});

//CREATE
router.post("/", middleObj.isLoggedIn, function(req, res){
	//get data from form and add to candidate array
	//redirect back to candidate
	var name = req.body.name;
	var image = req.body.image;
	var gender = req.body.gender;
	var vaccine = req.body.vaccine;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCandidate = {name:name, image:image, gender:gender, vaccine:vaccine, description:description, author: author};
	//create a new candidate and save to DB
	candidates.create(newCandidate, function(err, newCan){
		if(err){
			console.log(err);
		}else{
			req.flash("success", "Create Success!");
			res.redirect("/candidates");
		}
	});
});

//SHOW
router.get("/:id", middleObj.isLoggedIn, function(req, res){
	//find the candidates with provided id
	candidates.findById(req.params.id).populate("comments").exec(function(err, foundCandidate){
		if(err){
			console.log(err);
		}else{
			//render show template with that candidate
			res.render("candidates/show", {candidate:foundCandidate});
		}
	});
	
	
})

//EDIT
router.get("/:id/edit", middleObj.checkCandidateOwnership, function(req, res){
	candidates.findById(req.params.id, function(err, foundCandidate){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/candidates");
		}
		else{
			res.render("candidates/edit",{candidates: foundCandidate});
		}
	});
	
});

//UPDATE
router.put("/:id", middleObj.checkCandidateOwnership, function(req, res){
	//find and update the correct candidate
	//redirect somewhere(show page)
	candidates.findByIdAndUpdate(req.params.id, req.body.candidate, function(err, updatedCandidate){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/candidates");
		}else{
			req.flash("success", "Update Success!");
			res.redirect("/candidates/" + req.params.id);
		}
	})
	
});

//DESTORY
router.delete("/:id", middleObj.checkCandidateOwnership, function(req, res){
	candidates.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect("/candidates");
		}else{
			req.flash("success", "Delete Success!");
			res.redirect("/candidates");
		}
	});
});

module.exports = router;