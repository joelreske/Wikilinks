var React = require('react');
var ReactRouter = require('react-router');
var Pager = require('./helpers/Pager');
var Home = require('./react-components/Home');
var Play = require('./react-components/Play');
var Stats = require('./react-components/Stats');
var Wrapper = require('./react-components/Wrapper');
var PageNotFound = require('./react-components/PageNotFound');

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