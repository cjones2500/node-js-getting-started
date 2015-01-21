//HELPFUL Commands
// $heroku addons:open mongolab

var bodyParser = require('body-parser')
var multer = require('multer');

var http = require('http'),
    express = require('express'),
    path = require('path');

 
var app = express();
app.set('port', process.env.PORT || 5000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('public', path.join(__dirname, 'public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://ds031571.mongolab.com:31571/heroku_app33218048/userData/';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("in here");
});

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);
 
app.get('/', function (request, response) {
  	console.log(request.headers);
	response.send('<html><body><h1>Hello World</h1></body></html>');
});



//before http.createServer but after app.get
app.use(function (req,res) { 
    res.render('404', {url:req.url}); 
});

 
http.createServer(app).listen(app.get('port'), function(){
  	console.log('Express server listening on port ' + app.get('port'));
});
