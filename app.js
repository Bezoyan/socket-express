const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');

const routes = require('./routes');
const user = require('./routes/user');

var app = express();

app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(logger('combined'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response){
  response.render('index');
});

app.use(errorhandler());

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('messageChange', function (data) {
    console.log(data);
    socket.emit('receive', data.message.split('').reverse().join('') );
  });
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
