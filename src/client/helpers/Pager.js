var browserHistory = require('react-router').browserHistory;

var Paths = {'HOME': "/",
			 'PLAY': "/play",
			 'STAT': "/stat"};

module.exports.Paths = Paths;

// assumes path in Paths
module.exports.goToPath = function(path, gid) {
	var fullPath = path;

	if (path == Paths.PLAY || path == Paths.STAT) {
		if (!gid) {
			return
		} else {
			fullPath += "/" + gid;
		}
	}

	browserHistory.push(fullPath);
}