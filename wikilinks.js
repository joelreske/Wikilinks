var wikipedia = require("node-wikipedia");

// returns titles of pages linked to by pageTitle, calling callback when the list is made
var getLinksForPage = function (pageTitle, callback) {
	wikipedia.page.data(pageTitle, {}, function(response) {
		pageTitle = pageTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		var excludePatterns = new RegExp("^(Portal:|Help:|Category:|Wikipedia:|Help:|Template:|File:|Portal:|Book:|Template talk:|" + pageTitle + ")");
		var links = [];

		if (response) {
		    for (var i = 0; i < response.links.length; i++) {
		    	var page = response.links[i];

		    	if (!excludePatterns.test(page["*"])) {
		    		links.push(page["*"]);
		    	}
		    }
		}
		callback(links);
	});
}

var getShortestPath = function (startPage, endPage, callback) {
	procData = {queue: [startPage],
	            path: {}};
	procData.path[startPage] = [];

	_getShortestPath(startPage, endPage, procData, callback);	
}

function _getShortestPath(startPage, endPage, procData, callback) {
	if (procData.queue.length > 0) {
		getLinksForPage(procData.queue[0], function(links) {
			var currentPage = procData.queue.shift();
			var complete = false;

			for (var i = 0; i < links.length; i++) {
				var linkedPage = links[i];
				if (!procData.hasOwnProperty(linkedPage)) {
					procData.path[linkedPage] = procData.path[currentPage].slice();
					procData.path[linkedPage].push(currentPage);
					procData.queue.push(linkedPage);

					if (linkedPage == endPage) {
						complete = true;
						var answer = procData.path[endPage];
						answer.push(endPage);
						break;
					}
				}
			}
			if (complete) {
				callback(answer);
			} else {
				_getShortestPath(startPage, endPage, procData, callback);
			}
		});
	} else {
		callback([]);
	}
}

module.exports.getLinksForPage = getLinksForPage;
module.exports.getShortestPath = getShortestPath;