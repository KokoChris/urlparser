var express = require('express'),
	port    = process.env.PORT || 3000,
	app 	= express(),
	expressValidator = require('express-validator'),
	validator = require("validator"),
    bodyParser = require("body-parser"),
    shortid = require("shortid"),
    mongoose = require("mongoose");

var linkSchema = new mongoose.Schema({
	link:{

		  type:String,
		  unique:true,
		},
	_id: {
	    type: String,
	    unique: true,
	    'default': shortid.generate
	}	
});

var Link = mongoose.model("Link",linkSchema);

mongoose.connect("mongodb://localhost/linkparadise");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
        console.log(req.headers);

	res.send("this is the root route");
});

app.get("/short/:url",function(req,res){
	
	Link.find({_id :req.params.url.toString()},function(err,foundLink) {
        
		if(err){
			console.log(err);
		}else{
			
			if(foundLink.length !== 0){
				res.redirect(foundLink[0].link)
			}
			else{

				res.redirect("/");
			}
		}	
	});
});	

app.get("/*",function (req,res) {
	var hostIp = req.headers.host;
	if(validator.isURL(req.params["0"]) && req.params["0"] !== "favicon.ico"){
	    
			var newLink = {link: req.params["0"]};
			Link.create(newLink,function(err, link){
				if(err){
					res.redirect("/");
				}else{
					res.json({
						"original-url": link.link,
						"short-url": hostIp + "/short/" +link["_id"]
					});
				}
			});	

		
	}else{
		res.status(400).send("Invalid link,please try again")
	}
});

app.listen(port,function(){
	console.log("Server has started on port " + port);
});
