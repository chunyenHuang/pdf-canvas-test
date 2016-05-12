var app = angular.module('test');
app.controller('homeController', home);
app.$inject = ['$http', '$scope', '$location', 'addService'];
function home($http, $scope, $location, addService) {
  var vm = this;

  function pastePDF(url, location) {
    var options = {
      width: '100%',
      height: "100%",
      pdfOpenParams: {
        view: 'Fit',
        page: '1',
        toolbar: 0,
        navpanes: 0,
        scrollbar: 0,
      },
    };
    var loc = document.getElementById(location);
    PDFObject.embed(url, loc, options);
  };

  $scope.get = function () {
    pastePDF($scope.linkUrl, 'pdf-field');
  }

  $scope.default = function (num) {
    $scope.linkUrl = 'https://s3.amazonaws.com/pdf-canvas-test/test'+ num + '.pdf';
    pastePDF($scope.linkUrl, 'pdf-field');
  }

  $scope.saveToImg = function () {
    var back = document.getElementById('theImg');
    var drawing = document.getElementById('canvas');

    var newCan = document.createElement('canvas');
    newCan.className = 'hidden';
    newCan.setAttribute('id', 'newCan');
    newCan.width = 890;
    newCan.height = 690;
    var content = newCan.getContext('2d');
    content.drawImage(back, 0, 0, 890, 690);
    content.drawImage(drawing, 0, 0, 890, 690);
    document.body.appendChild(newCan);
    newCan.toBlob(function(blob) {
      saveAs(blob, "newCan.png");
    });
  }

  $scope.saveToImgHtml = function () {
    html2canvas($("#box"), {
      allowTaint: true,
      logging:true,
      onrendered: function(newCanvas) {
        document.body.appendChild(newCanvas);
        newCanvas.className = 'hidden';
        newCanvas.toBlob(function(blob) {
          saveAs(blob, "new.png");
        });
      }
    });
  }

  $scope.saveAsPdf = function() {
    html2canvas($("#box"), {
      allowTaint: true,
      logging:true,
      onrendered: function(newCanvas) {
        var data = newCanvas.toDataURL("image/png");
        var doc = {
          content: [
            { text: 'PDF Canvas Test', style: 'header' },
            {
              image: data,
              width: 450,
              margin: [ 0, 0, 0, 0 ],
            },
          ]
        }
        pdfMake.createPdf(doc).download("wow.pdf");
      }
    });
  }

  $scope.pdfToPng = function () {
    var convert = $http.get('/convert-pdf?theUrl=' + $scope.linkUrl);
    convert.then(function(res){
      console.log('The backgorund now is a PNG file.');
      $scope.pngUrl = res.data.imgUrl;
    })
  }

  function activate() {
    $scope.linkUrl = 'https://s3.amazonaws.com/pdf-canvas-test/test1.pdf';
    setTimeout(function () {
      pastePDF($scope.linkUrl, 'pdf-field');
    }, 1000)
  }
  activate();
}

app.directive('pdfBox', function () {
  return {
    templateUrl: 'pdf-box.html'
  }
})

app.directive("drawing", function(){
  return {
    restrict: "A",
    link: function(scope, element){
      var ctx = element[0].getContext('2d');
      var drawing = false;
      var lastX;
      var lastY;

      element.bind('mousedown', function(event){
        if(event.offsetX!==undefined){
          lastX = event.offsetX;
          lastY = event.offsetY;
        } else { // Firefox compatibility
          lastX = event.layerX - event.currentTarget.offsetLeft;
          lastY = event.layerY - event.currentTarget.offsetTop;
        }
        ctx.beginPath();
        drawing = true;
      });
      element.bind('mousemove', function(event){
        if(drawing){
          if(event.offsetX!==undefined){
            currentX = event.offsetX;
            currentY = event.offsetY;
          } else {
            currentX = event.layerX - event.currentTarget.offsetLeft;
            currentY = event.layerY - event.currentTarget.offsetTop;
          }
          draw(lastX, lastY, currentX, currentY);
          lastX = currentX;
          lastY = currentY;
        }
      });
      element.bind('mouseup', function(event){
        drawing = false;
      });
      function draw(lX, lY, cX, cY){
        ctx.moveTo(lX,lY);
        ctx.lineTo(cX,cY);
        ctx.strokeStyle = "#4bf";
        ctx.stroke();
      }
    }
  };
});
