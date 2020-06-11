var mongoose = require("mongoose");
//SCHEMA SETUP
var petLoverSchema = new mongoose.Schema({
	name:String,
	image:String,
	gender:String,
	vaccine:String,
	description:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"users"
		},
		username: String
	},
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"comments"
		}
	]
});

module.exports = mongoose.model("candidates", petLoverSchema);
