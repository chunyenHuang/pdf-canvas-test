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
  $scope.default = function () {
    $scope.linkUrl = 'https://s3.amazonaws.com/pdf-canvas-test/test.pdf';
    pastePDF($scope.linkUrl, 'pdf-field');
  }

  function activate() {
    $scope.linkUrl = 'https://s3.amazonaws.com/pdf-canvas-test/test.pdf';
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
