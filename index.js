var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');

var http = require('http'),
    fs = require('fs');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

fs.readFile('./index.html', function (err, html) {

	app.get('/', function(request, response) {
		response.writeHeader(200,{"Content-Type": "text/html"});
		response.write(html);
		response.end();
	});

});

var pg = require('pg');
app.get('/db', function(request,response){
	pg.connect(process.env.DATABASE_URL, function(err,client,done){
		client.query('SELECT * FROM test_table',function(err,result){
		done();
		if(err){ console.error(err); response.send("Error" + err);}
		else{ response.send(result.rows);}
		});
	});
});


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
