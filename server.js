var express = require('express');
var app = express();
var port = 1337;

app.use(express.static('./public/'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

app.listen(port, function () {
  console.log('server on port: ' + port);
})
