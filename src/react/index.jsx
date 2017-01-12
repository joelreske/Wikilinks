var ReactDOM = require('react-dom');
var React = require('react');
var ReactRouter = require('react-router');
var Pager = require('./Pager');
var Home = require('./Home');
var Play = require('./Play');
var Stats = require('./Stats');
var Wrapper = require('./Wrapper');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var browserHistory = ReactRouter.browserHistory;

ReactDOM.render((
  <Router history={browserHistory}>
  	<Route component={Wrapper}>
    	<Route path={Pager.Paths.HOME} component={Home}/>
    	<Route path={Pager.Paths.PLAY + "/:gid"} component={Play}/>
    	<Route path={Pager.Paths.STAT + "/:gid"} component={Stats}/>
    </Route>
  </Router>
), document.getElementById('app'));
