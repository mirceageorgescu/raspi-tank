$(function () {

   var socket = io.connect(),
    wIsDown = false,
    aIsDown = false,
    sIsDown = false,
    dIsDown = false,
    leftMotorPin = 11,
    rightMotorPin = 12;

  $(document).keydown(function(e){
    switch(e.which){
      case 87:
        if(wIsDown) return;
        wIsDown = true;
        socket.emit('turnOn', leftMotorPin);
        socket.emit('turnOn', rightMotorPin);
        $('.up').addClass('active');
        break;
      case 65:
        if(aIsDown) return;
        aIsDown = true;
        socket.emit('turnOn', leftMotorPin);
        $('.left').addClass('active');
        break;
      case 83:
        if(sIsDown) return;
        sIsDown = true;
        $('.down').addClass('active');
        break;
      case 68:
        if(dIsDown) return;
        dIsDown = true;
        socket.emit('turnOn', rightMotorPin);
        $('.right').addClass('active');
        break;
    }
  });

  $(document).keyup(function(e){
    switch(e.which){
      case 87:
        if(!wIsDown) reddturn;
        wIsDown = false;
        socket.emit('turnOff', leftMotorPin);
        socket.emit('turnOff', rightMotorPin);
        $('.up').removeClass('active');
        break;
      case 65:
        if(!aIsDown) return;
        aIsDown = false;
        socket.emit('turnOff', leftMotorPin);
        $('.left').removeClass('active');
        break;
      case 83:
        if(!sIsDown) return;
        sIsDown = false;
        $('.down').removeClass('active');
        break;
      case 68:
        if(!dIsDown) return;
        dIsDown = false;
        socket.emit('turnOff', rightMotorPin);
        $('.right').removeClass('active');
        break;
    }
  });


});
