var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	candidates = require("./models/candidates"),
	users = require("./models/users"),
	comments = require("./models/comments"),
	seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	candidateRoutes = require("./routes/candidates"),
	indexRoutes = require("./routes/index");

seedDB();
mongoose.connect('mongodb+srv://Jiayue:Zoe_06030913@petlover-5q6bb.mongodb.net/PetLover?retryWrites=true&w=majority', {
	useUnifiedTopology: true, 
	useNewUrlParser: true, 
	useCreateIndex: true
}).then(() => {
	console.log("Connect to DB!");
}).catch(err => {
	console.log("ERROR:", err.message)
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Hello this is the secret",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	//go to the next sentence
	next();
})

app.use(indexRoutes);
app.use("/candidates/:id/comments", commentRoutes);
app.use("/candidates", candidateRoutes);



app.listen(3000, process.env.IP, function(){
	console.log("https://petlover-gxdqs.run-us-west2.goorm.io");
	
});