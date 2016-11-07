var wikipedia = require("node-wikipedia");

// returns titles of pages linked to by pageTitle, calling callback when the list is made
var getLinksForPage = function (pageTitle, callback) {
	wikipedia.page.data(pageTitle, {}, function(response) {
		var excludePatterns = /^(Category:|Wikipedia:|Help:|Template:|File:|Portal:|Book:|Template talk:)/;
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

module.exports.getLinksForPage = getLinksForPage;