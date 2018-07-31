
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
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/jscripts', express.static(__dirname + '/node_modules/jquery/dist/'));
  app.use(express.favicon(path.join(__dirname, 'public','assets','favicon.ico'))); 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(credentials, app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
