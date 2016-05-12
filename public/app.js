var app = angular.module('test', ['ngRoute']);
app.$inject = ['$http'];

app.config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|file|chrome-extension):|data:image\//);
  }
]);

app.config(['$routeProvider', function($routeProvider, $routeParams) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'homeController',
      controllerAs: 'home',
    })
}]);

app.factory('addService', addService);
addService.$inject=['$http'];
function addService($http) {
  function addService() {
  }
  return {
    addService: addService,
  }
}
