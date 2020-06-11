//=============
//AUTH ROUTES
//==============
var express = require("express"),
	router = express.Router();
	passport = require("passport"),
	users = require("../models/users");
	

router.get("/", function(req, res){
	res.render("landing");
});


//show login form
router.get("/login", function(req, res){
	res.render("login");
})

//show register form
router.get("/register", function(req, res){
	res.render("register");
})

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new users({username: req.body.username});
	users.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Sign up Success!");
			res.redirect("/candidates");
		});
	});
});

//handle login logic 
//app.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local", 
	{
		successRedirect:"/candidates",
		failureRedirect:"/login"
	}),function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logout Success!");
	res.redirect("/candidates");
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
