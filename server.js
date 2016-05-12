var express = require('express');
var app = express();
var port = process.env.PORT || 1337;
var html5pdf = require("html5-to-pdf");
var PDFImage = require("pdf-image").PDFImage;
var im = require('imagemagick');
var fs = require("fs");
app.use(express.static('./public/'));

function randomText(length){
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(var x=0; x < length; x++){
    text += possible.charAt(Math.floor(Math.random() * possible.length)+1);
  }
  return text;
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
})

app.get('/convert-pdf', function(req, res) {
  var fullUrl = req.protocol + '://' + req.get('host');
  var pdfImage = new PDFImage(req.query.theUrl);
  pdfImage.pdfFileBaseName = randomText(15);
  pdfImage.outputDirectory = "./public/pdf-png/";
  pdfImage.convertPage(0).then(function (imagePath) {
    imagePath = imagePath.split('/');
    imagePath.splice(0,1);
    imagePath = fullUrl + '/' + imagePath.join('/');
    res.json({imgUrl: imagePath});
  });
})

app.listen(port, function () {
  console.log('server on port: ' + port);
})
