var express = require('express'),
	port    = process.env.PORT || 3000,
	app 	= express(),
	expressValidator = require('express-validator'),
	validator = require("validator"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

var linkSchema = new mongoose.Schema({
	link:String,
	shortLink:String
});

var Link = mongoose.model("Link",linkSchema);

mongoose.connect("mongodb://localhost/linkparadise");

app.use(bodyParser.urlencoded({extended: true}));



app.get("/",function(req,res){

	res.send("this is the root route");
});

app.get("/new",function(req,res){
	res.send("this is the new thing");
})

app.get("/*",function (req,res) {
    
	if(validator.isURL(req.params["0"])){
		var newLink = {link: req.params["0"], shortLink: "testing"};
		Link.create(newLink,function(err, link){
			if(err){
				console.log(err);
			}else{
				res.send(req.params);
			}
		});	
		
	}else{
		res.status(400).redirect("/new");
	}
});

app.listen(port,function(){
	console.log("Server has started on port " + port);
});
