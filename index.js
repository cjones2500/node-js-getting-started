var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var path = require('path');

var http = require('http'),
    fs = require('fs');

app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname + 'public')));

//fs.readFile('./index.html', function (err, html) {

	//route handler, express matches specific paths and completes them accordingly
	app.get('/', function(request, response) {
		//an example of how to get information from within the headers
		//console.log(request.headers['user-agent']);
		console.log(request.headers);
		
		response.send('<html><body><h1>Hello World</h1></body></html>');
		//response.writeHeader(200,{"Content-Type": "text/html"});
		//response.write(html);
		//response.end();
	});

//});

/*var pg = require('pg');
app.get('/db', function(request,response){
	pg.connect(process.env.DATABASE_URL, function(err,client,done){
		client.query('SELECT * FROM test_table',function(err,result){
		done();
		if(err){ console.error(err); response.send("Error" + err);}
		else{ response.send(result.rows);}
		});
	});
});*/

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


/*app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});*/
