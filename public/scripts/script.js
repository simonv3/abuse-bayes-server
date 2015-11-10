var socket = io();

$('.mark').on('click', function(){
  var that = this;
  console.log($(that).parents('li').data());
  var data = $(that).parents('li').data();
  data.action = $(that).data('action');
  console.log(data);
  socket.emit('mark', data);
  return false;
});

socket.on('deleted', function(item) {
  $('[data-tweet-id=' + item.tweetId + ']').hide(200);
  console.log('deleted', item);
});
