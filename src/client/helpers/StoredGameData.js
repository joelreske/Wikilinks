var gameData = {"gid": "",
				"path": [],
				"time": 0};

module.exports.storeGameData = function(gid, path, time) {
	gameData.gid = gid;
	gameData.path = path;
	gameData.time = time;
}

module.exports.isDataStoredForGame = function(gid) {
	return gameData.gid == gid;
}

module.exports.clear = function() {
	gameData.gid = '';
	gameData.path = [];
	gameData.time = 0;
}

module.exports.getGameData = function() {
	return gameData;
}