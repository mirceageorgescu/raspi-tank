/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    gpio = require('pi-gpio'),
    crypto = require('crypto'),
    async = require('async'),
    _leftMotorFront  = 11,
    _leftMotorBack   = 12,
    _rightMotorFront = 15;
    _rightMotorBack  = 16;

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


var motorOn = function(motor){
  gpio.open(motor, function(){
    gpio.write(motor, 1, function(){
      gpio.close(motor);
    });
  });
}

var motorOff = function(motor){
  gpio.open(motor, function(){
    gpio.write(motor, 0, function(){
      gpio.close(motor);
    });
  });
}

var moveForward = function(){
  async.series([
    motorOn(_leftMotorFront),
    motorOn(_rightMotorFront)
  ], function(){console.log('done!')});
}

var moveBackward = function(){
  async.series([
    motorOn(_leftMotorBack),
    motorOn(_rightMotorBack)
  ], function(){console.log('done!')});
}

var turnLeft = function(){
  async.series([
    motorOn(_rightMotorFront)
  ], function(){console.log('done!')});
}

var turnRight = function(){
  async.series([
    motorOn(_leftMotorFront)
  ], function(){console.log('done!')});
}

var stopAllMotors = function(){
  async.series([
    motorOff(_leftMotorFront),
    motorOff(_leftMotorBack),
    motorOff(_rightMotorFront),
    motorOff(_rightMotorBack)
  ]);
}

io.sockets.on('connection', function(socket) {

  socket.on('keydown', function(dir) {
    switch(dir){
     case 'up':
        moveForward();
        break;
      case 'down':
        moveBackward();
        break;
      case 'left':
        turnLeft();
        break;
      case 'right':
        turnRight();
        break;
    }
  });

  socket.on('keyup', function(dir){
    stopAllMotors();
  });

});
