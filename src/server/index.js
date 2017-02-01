require('babel-core/register')({
    presets: ['es2015', 'react']
});

var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var api_router     = require('./Api-Router');
var client_router  = require('./Client-Router');
var path           = require('path');

var ROOT_DIR       = path.resolve(".");

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(ROOT_DIR + '/public'));
app.set('views', ROOT_DIR + '/pages');
app.set('view engine', 'ejs');

app.get('/*', function(request, response, next) {
    var isWww = false;
    for (var i = 0; i < request.subdomains.length; i++) {
        if (request.subdomains[i] == 'www') {
            isWww = true;
            break;
        }
    }

    if (isWww) {
        var hostname = request.hostname.split(".");
        var newHostname = hostname[hostname.length - 2] + "." +hostname[hostname.length - 1];
        response.redirect(301, request.protocol + "://" + newHostname + request.originalUrl);
    } else {
        next();
    }
});

app.use('/api', api_router);
app.use('*', client_router);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
