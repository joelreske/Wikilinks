module.exports.storeGame = function(gid, start, end) { 
	putGidOrder(gid)
	putInStorage(gid, {"start": start, "end": end});
};

module.exports.getAllStoredGames = function() {
	var gidOrder = getGidOrder();
	var storedGames = [];

	for (var i = gidOrder.length - 1; i >= 0; i--) {
		var game = getFromStorage(gidOrder[i]);
		game['gid'] = gidOrder[i];
		storedGames.push(game);
	}

	return storedGames;
}

function getGidOrder() {
	return getFromStorage("gidOrder")
}

function putGidOrder(gid) {
	if (!gid) {
		putInStorage("gidOrder", []);
	} else {
		var gidOrder = getGidOrder(),
		    prevGidLoc = gidOrder.indexOf(gid);

		if (prevGidLoc > -1) {
			gidOrder.splice(prevGidLoc, 1);
		}

		gidOrder.push(gid);

		putInStorage("gidOrder", gidOrder);
	}
}

function putInStorage(id, obj) {
	window.localStorage.setItem(id, JSON.stringify(obj));
}

function getFromStorage(id) {
	var item = window.localStorage.getItem(id);
	if (!item) {
		putGidOrder();
		return [];
	}
	return JSON.parse(item);
}