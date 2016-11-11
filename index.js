var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var wikilinks = require("./wikilinks.js");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use("/styles",express.static(__dirname + "/views/stylesheets"));

// Taken from Ming's example code
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/wikilinktestdb';
var MongoClient = require('mongodb').MongoClient;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.get('/api/startGame', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var start = request.query.start;
	var end = request.query.end;
	var gameId = generateUniqueRandomId('games');

	if (start && end) {
		var toInsert = {
			"start": start,
			"end": end,
			"uniqueId": gameId
		};

		db.collection('games', function(error, coll) {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					response.sendStatus(500);
				}
				else {
					delete toInsert["_id"];
					response.send(toInsert);
				}
		    });
		});
	} else {
		response.sendStatus(400);
	}
});

app.get('/api/getRandomPage', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var request = require('request');
	var r = request.get('https://en.wikipedia.org/wiki/Special:Random', function (err, res, body) {
		if (err) {
			response.sendStatus(500);
		} else {
			var urlParts = res.request.uri.href.split("/");
			response.send({pageTitle:decodeURIComponent(urlParts[urlParts.length - 1]).replace(/_/g, " ")});
		}
	});
});

app.get('/api/getLinksForPage', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var page = request.query.page;

	wikilinks.getLinksForPage(page, function(results) {
		response.send(results);
	});
});

app.get('/api/getShortestPath', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var start = "Fire";
	var end = "Crotch";

	// var start = request.query.start;
	// var end = request.query.end;

	wikilinks.getShortestPath(start, end, function(shortestPath) {
		response.send(shortestPath);
	});
});

app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});

function enableCORS(response) {
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

function generateUniqueRandomId(collection) {
	var randomId = generateRandomId();

	db.collection(collection, function(er, collection) {
		if (er) {
			return "";
		} else {
			collection.find({"uniqueId":randomId}).toArray(function(err, docs) {
				if (err) {
					return "";
				} else {
					if (docs.length > 0) {
						randomId = generateUniqueRandomId(collection);
					}
				}
			});
		}
	});

	return randomId;
}

function generateRandomId() {
	var size = 8;
	var httpSafeChars = ["A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f", "G", "g", "H", "h", "I", "i", "J", "j", "K", "k", "L", "l", "M", "m", "N", "n", "O", "o", "P", "p", "Q", "q", "R", "r", "S", "s", "T", "t", "U", "u", "V", "v", "W", "w", "X", "x", "Y", "y", "Z", "z", "_", "-", "~"];
	var id = "";

	for (var i = 0; i < 8; i++) {
		var index = Math.floor((Math.random() * httpSafeChars.length));
		id += httpSafeChars[index];
	}

	return id;
}