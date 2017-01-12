var React = require('react');
var ReactRouter = require('react-router');
var Pager = require('./Pager');
var Home = require('./Home');
var Play = require('./Play');
var Stats = require('./Stats');
var Wrapper = require('./Wrapper');
var PageNotFound = require('./PageNotFound');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;

module.exports.route = function() {
	return (<Router history={browserHistory}>
  				<Route component={Wrapper}>
					<Route path={Pager.Paths.HOME} component={Home}/>
    				<Route path={Pager.Paths.PLAY + "/:gid"} component={Play}/>
    				<Route path={Pager.Paths.STAT + "/:gid"} component={Stats}/>
    				<Route path='/*' component={PageNotFound}/>
				</Route>
  			</Router>);
}