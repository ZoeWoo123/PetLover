var mongoose = require("mongoose"),
	candidates = require("./models/candidates"),
	comments = require("./models/comments");

var data = [
	{
			name:"JoJo",
			image:"data:image/jpeg;base64,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",
			gender:"Female",
			vaccine:"Yes",
			description:"JoJo is a lovely girl with soft fur and cheerful personality.",
			author:{
				id:"5ee1d0a764bdb50b6e8d406d",
				username:"woo"
			}
	},
	{
			name: "CoCo", 
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQG2kbrcgxggmyTvTm6K0ERSq_ZN-2E82XaGF1js65nOIDtveRg&usqp=CAU",
			gender: "Male",
			vaccine: "Yes",
			description: "CoCo is very lively and lovely. She is an excellent companion dog.",
			author:{
				id:"5ee1d0a764bdb50b6e8d406d",
				username:"woo"
			}
	},
	{
			name: "Happy",
			image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQU3PYxvVpBMR4gImdiEDZVzGmIafMUaya1u598Ei_NkFTzZVDX&usqp=CAU",
			gender: "Male",
			vaccine: "Yes",
			description: "Happy is a very happy boy and he will bring you happiness.",
			author:{
				id:"5ee1d0a764bdb50b6e8d406d",
				username:"woo"
			}
	
	}
];
function seedDB(){
	//remove all candidates
	candidates.deleteMany({}, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log("Removed candidates!");
			comments.deleteMany({}, function(err){
				if(err)
				{
					console.log(err);
				}
				else
				{
					console.log("Removed comments!");
					data.forEach(function(seed){
						candidates.create(seed, function(err, candidate){
							if(err)
							{
								console.log(err);
							}
							else
							{
								console.log("Created a candidate!");
								comments.create(
									{
										text:"I wanna give this boy a home!",
										author:{
											id:"5ee1d0a764bdb50b6e8d406d",
											username:"woo"
										}
									}, function(err, comment){
										if(err)
										{
											console.log(err);
										}
										else
										{
											candidate.comments.push(comment);
											candidate.save();
											console.log("Created new comment!");
										}
									}
								);

							}
						});
					});
				}
			});
			
		}
	});
	
}
module.exports = seedDB;
