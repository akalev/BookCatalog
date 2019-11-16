'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.book',
  'myApp.version',
  'myApp.service'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/book'});
}])
.constant('config', {
  env: {
    apiUrl: 'localhost:8080'
  }
});
