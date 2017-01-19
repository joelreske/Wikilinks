// page var should be from Pager.js Paths enum
module.exports.sendPageView = function(page) {
	ga('set', 'page', page);
	ga('send', 'pageview');
}