//1
var http = require('http'),
    express = require('express'),
    path = require('path');
 
//2 
var app = express();
app.set('port', process.env.PORT || 3000); 
app.use(express.static(path.join(__dirname, 'public')));
 
app.get('/', function (request, response) {
  	console.log(request.headers);
	response.send('<html><body><h1>Hello World</h1></body></html>');
});
 
http.createServer(app).listen(app.get('port'), function(){
  	console.log('Express server listening on port ' + app.get('port'));
});
