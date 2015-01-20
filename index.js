//HELPFUL Commands
// $heroku addons:open mongolab


var bodyParser = require('body-parser')
var multer = require('multer');

var http = require('http'),
    express = require('express'),
    path = require('path');

//establish database interface
var MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;

 
var app = express();
app.set('port', process.env.PORT || 5000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//active adds the public extension to the basic filePath (But no cookies?)
//any HTML file that goes into this directory will be visible online :)
app.set('public', path.join(__dirname, 'public'));
//this line does the same as above and also does not include cookies?
//app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//app.use(express.bodyParser());

// parse json formatted documents
//app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
//app.use(multer());

//mongodb://heroku_app33218048:tiisud5pugrqjpfcfep2d00jd9@ds031571.mongolab.com:31571/heroku_app33218048

//implement sections of the mongoDb
//var mongoHost = 'localHost'; ds012345.mongolab.com
//var mongoHost = 'heroku_app33218048:tiisud5pugrqjpfcfep2d00jd9@ds031571.mongolab.com';
var mongoHost = 'ds031571.mongolab.com'
var mongoPort = 31571;
var mongoDatabase = 'heroku_app33218048'; 
//var mongoHost = 'localHost'
//var mongoPort = '27017'

var collectionDriver;
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.open(function(err, mongoClient) { //C
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  var db = mongoClient.db(mongoDatabase);  //E
  console.log("connection to database:",db);
  collectionDriver = new CollectionDriver(db); //F
});

//mongodb://ds031571.mongolab.com:31571/heroku_app33218048/userData/

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://ds031571.mongolab.com:31571/heroku_app33218048/userData/');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("we're on ");
});*/

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

/*app.get('/:collection', function(req, res) { //A
    var params = req.params; //B
    collectionDriver.findAll(req.params.collection, function(error, objs) { //C
	if (error) { res.send(400, error);} //D
	else { 
	    if (req.accepts('html')) { //E
		res.render('data',{objects: objs, collection: req.params.collection}); //F
	    }

	    else {
		res.set('Content-Type','application/json'); //G
		res.send(200, objs); //H
	    }
	}
    });
});*/

app.get('/:collection', function(req, res, next) {  
   var params = req.params;
   var query = req.query; //1
   if (query) {
        //query = JSON.parse(query); //required for multiple queries 
        collectionDriver.query(req.params.collection, query, returnCollectionResults(req,res)); //3
   } else {
	//do nothing
        //collectionDriver.findAll(req.params.collection, returnCollectionResults(req,res)); //4
   }
});
 
function returnCollectionResults(req, res) {
    return function(error, objs) { //5
        if (error) { res.send(400, error); }
	        else { 
                    if (req.accepts('html')) { //6
                        res.render('data',{objects: objs, collection: req.params.collection});
                    } else {
                        res.set('Content-Type','application/json');
                        res.send(200, objs);
                }
        }
    };
};
 
app.get('/:collection/:entity', function(req, res) { //I
    console.log("get function activated for get");
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
	collectionDriver.get(collection, entity, function(error, objs) { //J
	    if (error) { res.send(400, error); }
	    else { res.send(200, objs); } //K
	});
    } else {
	res.send(400, {error: 'bad url', url: req.url});
    }
});

app.post('/:collection', function(req, res) { //A
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) { res.send(400, err); } 
          else { res.send(201, docs); } //B
     });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C
       });
   } else {
       var error = { "message" : "Cannot PUT a whole collection" };
       res.send(400, error);
   }
});



app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
   }
});


//before http.createServer but after app.get
app.use(function (req,res) { 
    res.render('404', {url:req.url}); 
});

 
http.createServer(app).listen(app.get('port'), function(){
  	console.log('Express server listening on port ' + app.get('port'));
});
