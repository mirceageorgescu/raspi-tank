/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    gpio = require('pi-gpio'),
    crypto = require('crypto'),
    async = require('async'),
    tank = {},
    _leftMotorFront  = 11,
    _leftMotorBack   = 12,
    _rightMotorFront = 15,
    _rightMotorBack  = 16,
    app = module.exports = express.createServer(),
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

tank.motorOn = function(motor){
  gpio.open(motor, function(){
    gpio.write(motor, 1, function(){
      gpio.close(motor);
    });
  });
};

tank.motorOff = function(motor){
  gpio.open(motor, function(){
    gpio.write(motor, 0, function(){
      gpio.close(motor);
    });
  });
};

tank.moveForward = function(){
  async.series([
    tank.motorOn(_leftMotorFront),
    tank.motorOn(_rightMotorFront)
  ]);
};

tank.moveBackward = function(){
  async.series([
    tank.motorOn(_leftMotorBack),
    tank.motorOn(_rightMotorBack)
  ]);
};

tank.turnLeft = function(){
  tank.motorOn(_rightMotorFront);
};

tank.turnRight = function(){
  tank.motorOn(_leftMotorFront);
};

tank.stopAllMotors = function(){
  async.series([
    tank.motorOff(_leftMotorFront),
    tank.motorOff(_leftMotorBack),
    tank.motorOff(_rightMotorFront),
    tank.motorOff(_rightMotorBack)
  ]);
};

io.sockets.on('connection', function(socket) {

  socket.on('keydown', function(dir) {
    switch(dir){
     case 'up':
        tank.moveForward();
        break;
      case 'down':
        tank.moveBackward();
        break;
      case 'left':
        tank.turnLeft();
        break;
      case 'right':
        tank.turnRight();
        break;
    }
  });

  socket.on('keyup', function(dir){
    tank.stopAllMotors();
  });

});
