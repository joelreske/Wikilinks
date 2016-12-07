var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/wikilinktestdb';
var MongoClient = require('mongodb').MongoClient;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

function createGame(startPage, endPage, callback) {
	var toInsert = {
		"start": escape(startPage),
		"end": escape(endPage),
		"gameId": generateUniqueRandomId('games')
	};

	db.collection('games', function(error, coll) {
		var id = coll.insert(toInsert, function(error, saved) {
			if (error) {
				callback(null);
			} else {
				toInsert["gid"] = toInsert["gameId"];
				delete toInsert["_id"];
				delete toInsert["gameId"];
				callback(toInsert);
			}
	    });
	});
}

function addPathToGame(gameId, username, path, time, callback) {
	var toInsert = {
		"gameId": escape(gameId),
		"pathLength": path.length,
		"username": escape(username),
		"path": JSON.stringify(path),
		"time": escape(time)
	};

	db.collection('completed_games', function(error, coll) {
		if (error) {
			callback(true);
		} else {
			var id = coll.insert(toInsert, function(error, saved) {
				if (error) {
					callback(true);
				} else {
					callback(false);
				}
		    });
		}
	});
}

function getGameData(gameId, callback) {
	db.collection('games', function(error, coll) {
		if (error) {
			callback(null);
		} else {
			coll.find({"gameId": escape(gameId)}).toArray(function(err, docs) {
				if (err) {
					callback(null);
				} else {
					callback(docs);
				}
			});
		}
	});
}

// assumes gameId is valid
function getGameResults(gameId, callback) {
	db.collection('completed_games', function(er, collection) {
		if (er) {
			callback(null);
		} else {
			collection.find({"gameId": escape(gameId)}).sort({'pathLength':1}).toArray(function(err, docs) {
				if (err) {
					callback(null);
				} else {
					callback(docs);
				}
			});
		}
	});
}

function isValidGameId(gameId, callback) {
	db.collection('games', function(er, collection) {
		if (er) {
			callback(false);
		} else {
			collection.find({"gameId": gameId}).toArray(function(err, docs) {
				if (err) {
					callback(false);
				} else {
					callback(docs.length == 1);
				}
			});
		}
	});
}

/* ---------------------------Export---------------------------- */

module.exports.createGame = createGame;
module.exports.isValidGameId = isValidGameId;
module.exports.getGameResults = getGameResults;
module.exports.getGameData = getGameData;
module.exports.addPathToGame = addPathToGame;

/* ---------------------------Helper Functions---------------------------- */

function escape(stringValue) {
	return stringValue;
}

function generateRandomId() {
	var size = 8;
	var httpSafeChars = ["A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f", "G", "g", "H", "h", "I", "i", "J", "j", "K", "k", "L", "l", "M", "m", "N", "n", "O", "o", "P", "p", "Q", "q", "R", "r", "S", "s", "T", "t", "U", "u", "V", "v", "W", "w", "X", "x", "Y", "y", "Z", "z", "_", "-", "~"];
	var id = "";

	for (var i = 0; i < size; i++) {
		var index = Math.floor((Math.random() * (httpSafeChars.length - 1)));
		id += httpSafeChars[index];
	}

	return id;
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
