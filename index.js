var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var db = require("./internal_modules/dbhelper.js");
var wikilinks = require("./internal_modules/wikilinks.js");
var emailshare = require("./internal_modules/emailshare.js");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
	var time = request.body.time;

	if (gid && path && username && time) {
		db.isValidGameId(gid, function(valid) {
			if (valid) {
				db.addPathToGame(gid, username, path, time, function(error) {
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
		db.isValidGameId(gid, function(valid) {
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
		db.isValidGameId(gid, function(valid) {
			if (valid) {
				db.getGameResults(gid, function(data) {
					if (data) {
						response.send(createDataForChart(data));
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

app.get('/api/isValidGid', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	db.isValidGameId(request.query.gid, function(valid) {
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

app.post('/api/share', function(request, response) {
	var userName = request.body.userName;
	var friendName = request.body.friendName;
	var email = request.body.email;
	var gid = request.body.gid;

	if (userName && friendName && email && gid) {
		db.isValidGameId(gid, function(valid) {
			if (valid) {
				db.getGameData(gid, function(data) {
					if (data) {
						emailshare.share(userName, friendName, email, data.start, data.end, request.protocol + "://" + request.hostname + "/?gid=" + gid, function(success) {
							if (success) {
								response.sendStatus(200);
							} else {
								response.sendStatus(500);
							}
						});
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

app.get('/*', function(request, response){
  	response.sendFile(__dirname + '/public/index.html');
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

function createDataForChart(data) {
	var googleChartOptions = {
			legend: "none",
			hAxis: {title: 'Number of Pages',
					textStyle:{color: 'white'},
					titleTextStyle:{color: 'white'},
					baselineColor:'#FFF'},
			vAxis: {title: 'Time (seconds)',
					textStyle:{color: '#FFF'},
					titleTextStyle:{color: 'white'},
					baselineColor:'#FFF'},
			backgroundColor: { fill:'transparent' },
			colors: ['#FFBC00']
        };


	var googleChartData = {
		"cols":[
			{"label":"Number of Pages", "type":"number"},
			{"label":"Time", "type":"number"},
			{"type": 'string', "role": 'tooltip'}],
		"rows":[]
	};

	for (var i in data) {
		var item = data[i];

		var row = {c:
			[{v: item.pathLength},
             {v: item.time},
             {v: item.username + " found a path through " + item.pathLength + " pages in " + item.time + " seconds"}
        	]}

        googleChartData["rows"].push(row);
	}


	return {"data":googleChartData, "options":googleChartOptions};
}
