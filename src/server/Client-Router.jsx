var express        = require('express')
var router         = express.Router()
var path           = require('path');
var ROOT_DIR       = path.resolve(".");

var React          = require('react');
var ReactDOM       = require('react-dom/server');
var reactRouter    = require('react-router');
var appRouter      = require(ROOT_DIR + '/src/client/Router.jsx');
var routes         = reactRouter.createRoutes(appRouter.route());

router.get('/*', function(request, response) {
    reactRouter.match({routes, location: request.url}, (error, redirectLocation, renderProps) => {
        if (error) {
            response.status(500).send(error.message);
        } else if (redirectLocation) {
            response.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            var content = ReactDOM.renderToString(<reactRouter.RouterContext {...renderProps}/>);
            response.render('index', {'content': content});
        } else {
            res.sendStatus(404);
        }
    });   
});

module.exports = router;