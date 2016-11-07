var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var wikilinks = require("./wikilinks.js");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// Taken from Ming's example code
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// var mongoUri = process.env.MONGODB_URI;
// var MongoClient = require('mongodb').MongoClient;
// var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
// 	db = databaseConnection;
// });

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.get('/api/getLinksForPage', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var page = request.query.page;

	wikilinks.getLinksForPage(page, function(results) {
		response.send(results);
	});
});

app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});

function enableCORS(response) {
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}