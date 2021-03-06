
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , fs = require('fs')
  , path = require('path');

// This line is from the Node.js HTTPS documentation.
var privateKey = fs.readFileSync('./certs/server.key');
var certificate = fs.readFileSync('./certs/server.crt');

var credentials = {key: privateKey, cert: certificate};

var app = express()

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/jscripts', express.static(__dirname + '/node_modules/jquery/dist/'));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Create an HTTPS service identical to the HTTP service.
https.createServer(credentials, app).listen(8443, function(){
  console.log("Express server listening on port 8443");
});
