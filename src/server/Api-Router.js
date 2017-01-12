var express        = require('express')
var router         = express.Router();

var db             = require("./internal_modules/dbhelper");
var wikilinks      = require("./internal_modules/wikilinks");
var emailshare     = require("./internal_modules/emailshare");

router.get('/startGame', function(request, response) {
    response.setHeader('Content-Type', 'application/json');

    var start = request.query.start;
    var end = request.query.end;

    if (start && end) {
        wikilinks.getPageTitle(start, function(startPage) {
            if (startPage != null) {
                wikilinks.getPageTitle(end, function(endPage) {
                    if (endPage != null) {
                        db.createGame(startPage, endPage, function(gameData) {
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
            } else {
                response.sendStatus(400);
            }
        });
    } else {
        response.sendStatus(400);
    }
});

router.post('/endGame', function(request, response) {
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

router.get('/getGameData', function(request, response) {
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

router.get('/getGameResults', function(request, response) {
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

router.get('/isWikipediaPage', function(request, response) {
    response.setHeader('Content-Type', 'application/json');

    wikilinks.isWikipediaPage(request.query.page, function(valid) {
        response.send({
            "valid": valid
        });
    });
});

router.get('/isValidGid', function(request, response) {
    response.setHeader('Content-Type', 'application/json');

    db.isValidGameId(request.query.gid, function(valid) {
        response.send({
            "valid": valid
        });
    });
});

router.get('/getRandomPage', function(request, response) {
    response.setHeader('Content-Type', 'application/json');

    var request = require('request');
    var r = request.get('https://en.wikipedia.org/wiki/Special:Random', function(err, res, body) {
        if (err) {
            response.sendStatus(500);
        } else {
            var urlParts = res.request.uri.href.split("/");
            response.send({
                pageTitle: decodeURIComponent(urlParts[urlParts.length - 1]).replace(/_/g, " ")
            });
        }
    });
});

router.get('/getLinksForPage', function(request, response) {
    response.setHeader('Content-Type', 'application/json');

    var page = request.query.page;

    wikilinks.getLinksForPage(page, function(results) {
        response.send(results);
    });
});

router.post('/share', function(request, response) {
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

function createDataForChart(data) {
	var series = [[]];
    for (var i in data) {
        var item = data[i];
        item.time = parseFloat(item.time);

        if (item.time > 0 && item.pathLength > 0){
        	var metaString = "<b>" + item.username + "</b></br>" + item.pathLength + " articles</br>" + item.time + " seconds";
        	series[0].push({x: parseFloat(item.time), y: item.pathLength, meta: metaString});
        }
    }

    return {
        "series": series
    };
}

module.exports = router;