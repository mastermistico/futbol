var port = process.env.PORT || 3000;
var express  = require('express');
var app = express();
var Twitter = require('twitter');
var madrid = 0,
    barcelona = 0,
    total = 0;

app.set('port', (process.env.PORT || 3000));
//app.use(express.static(__dirname + '/public'));
/*var server = app.listen(5000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});*/

var server = app.listen(app.get('port'), function() {

  		
  console.log("Node app is running at localhost:" + app.get('port'));
});

var io = require('socket.io').listen(server);

var client = new Twitter({
  consumer_key: 'GHUf65msg3VlzpOrNN7GChIMY',
  consumer_secret: 'PniIQEEqNfwWnjdN3KkiYi7laN6xFF2DSKvJtrc5vYxIAoeVFv',
  access_token_key: '2239995774-ttJJRyU20OPHBlSsjWA3y58Em9syYmqGNkpzGhX',
  access_token_secret: 'RSskwDX6qGfdltOzU1bAhNb8NcSc6ZLYGmR3yhAEPvzuB'
});

client.stream('statuses/filter', { track: ['hala madrid','visca barza','halamadrid','fcbarcelona'] }, function(stream) {
  
    stream.on('error', function(error) {
    
  });
  stream.on('data', function (tweet) {
    
    if (tweet.text) { 
      var text = tweet.text.toLowerCase();
      if ((text.indexOf('hala madrid') != -1) || (text.indexOf('halamadrid') != -1)) {
        madrid++
        total++

        if ((madrid % 5) == 0){
          
          io.sockets.emit('madridr', { 
            user: tweet.user.screen_name, 
            text: tweet.text,
            avatar: tweet.user.profile_image_url_https
          });
        }
      }
      if (text.indexOf('fcbarcelona') != -1 ) || (text.indexOf('visca barza') != -1)) {
        barcelona++
        total++
        if ((barcelona % 5) == 0){
          io.sockets.emit('barcelonar', { 
            user: tweet.user.screen_name, 
            text: tweet.text,
            avatar: tweet.user.profile_image_url_https
          });
        }
      }
      io.sockets.emit('percentages', { 
        madrid: (madrid/total)*100,
        barcelona: (barcelona/total)*100
      });
    }
  });
});


app.get('/', function(request, response) {
  //response.send('Hello World!');
  response.sendFile(__dirname + '/index.html');
  
});


