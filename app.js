/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    gpio = require('pi-gpio'),
    crypto = require('crypto');

var app = module.exports = express.createServer(),
    io = sio.listen(app);

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log('Listening %d in %s mode', app.address().port, app.settings.env);

io.sockets.on('connection', function(socket) {

    socket.on('turnOn', function(pin) {
        gpio.open(pin, 'output', function(err){
            gpio.write(pin, 1, function(){
                gpio.close(pin);
            });
	});
    });
    
    socket.on('turnOff', function(pin) {
        gpio.open(pin, 'output', function(err){
            gpio.write(pin, 0, function(){
                gpio.close(pin);
            });
        });
    });

});
