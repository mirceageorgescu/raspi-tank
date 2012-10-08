$(function () {

   var socket = io.connect(),
    wIsDown = false,
    aIsDown = false,
    sIsDown = false,
    dIsDown = false;

  $(document).keydown(function(e){
    switch(e.which){
      case 87:
        if(wIsDown) return;
        wIsDown = true;
        socket.emit('keydown', 'up');
        $('.up').addClass('active');
        break;
      case 65:
        if(aIsDown) return;
        aIsDown = true;
        socket.emit('keydown', 'left');
        $('.left').addClass('active');
        break;
      case 83:
        if(sIsDown) return;
        sIsDown = true;
        socket.emit('keydown', 'down');
        $('.down').addClass('active');
        break;
      case 68:
        if(dIsDown) return;
        dIsDown = true;
        socket.emit('keydown', 'right');
        $('.right').addClass('active');
        break;
    }
  });

  $(document).keyup(function(e){
    switch(e.which){
      case 87:
        if(!wIsDown) return;
        wIsDown = false;
        socket.emit('keyup', 'up');
        $('.up').removeClass('active');
        break;
      case 65:
        if(!aIsDown) return;
        aIsDown = false;
        socket.emit('keyup', 'left');
        $('.left').removeClass('active');
        break;
      case 83:
        if(!sIsDown) return;
        sIsDown = false;
        socket.emit('keyup', 'down');
        $('.down').removeClass('active');
        break;
      case 68:
        if(!dIsDown) return;
        dIsDown = false;
        socket.emit('keyup', 'right');
        $('.right').removeClass('active');
        break;
    }
  });


});
