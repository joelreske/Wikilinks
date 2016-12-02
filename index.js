var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var React = require('react');
var ReactDOM = require('react-dom');


var db = require("./internal_modules/dbhelper.js");
var wikilinks = require("./internal_modules/wikilinks.js");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use("/styles",express.static(__dirname + "/views/stylesheets"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

	if (start && end) {
		db.createGame(start, end, function(gameData) {
			if (gameData) {
				response.send(gameData);
			} else {
				response.sendStatus(500);
			}
		});
	} else {
		response.sendStatus(400);
	}
});

app.post('/api/endGame', function(request, response) {
	var gid = request.body.gid;
	var username = request.body.username;
	var path = request.body.path;

	if (gid && path && username) {
		db.isValidgid(gid, function(valid) {
			if (valid) {
				db.addPathToGame(gid, username, path, function(error) {
					if (error) {
						response.sendStatus(500);
					} else {
						response.sendStatus(200);
					}
				});
			} else {
				response.sendStatus(400);
			}
		});
	} else {
		response.sendStatus(400);
	}
});

app.get('/api/getGameData', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var gid = request.query.gid;

	if (gid) {
		db.isValidgid(gid, function(valid) {
			if (valid) {
				db.getGameData(gid, function(data) {
					if (data) {
						response.send(data);
					} else {
						response.sendStatus(500);
					}
				});
			} else {
				response.sendStatus(400);
			}
		});
	} else {
		response.sendStatus(400);
	}
});

app.get('/api/getGameResults', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var gid = request.query.gid;

	if (gid) {
		db.isValidgid(gid, function(valid) {
			if (valid) {
				db.getGameResults(gid, function(data) {
					if (data) {
						response.send(data);
					} else {
						response.sendStatus(500);
					}
				});
			} else {
				response.sendStatus(400);
			}
		});
	} else {
		response.sendStatus(400);
	}
});

app.get('/api/isWikipediaPage', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	wikilinks.isWikipediaPage(request.query.page, function(valid){
		response.send({"valid":valid});
	});
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

// app.get('/api/getShortestPath', function(request, response) {
// 	response.setHeader('Content-Type', 'application/json');

// 	var start = "Fire";
// 	var end = "Crotch";

// 	// var start = request.query.start;
// 	// var end = request.query.end;

// 	wikilinks.getShortestPath(start, end, function(shortestPath) {
// 		response.send(shortestPath);
// 	});
// });

app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});
