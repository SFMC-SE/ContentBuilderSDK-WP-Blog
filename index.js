var express = require('express');
var path = require('path');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(req, res){
	var apiurl = process.env.wpendpoint || "https://wordpress.imhlabs.com/wp-json/wp/v2/";
  var appName = process.env.appName || "Content Builder SDK - Wordpress Blog";
	res.render('pages/index',{
		"apiurl" : apiurl,
    "appName" : appName
	});
});
