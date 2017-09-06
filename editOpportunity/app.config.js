'use strict';

app.config(function($routeProvider) {
  $routeProvider
      .when("/", {
        templateUrl : "genre-list/genre-list.html",
      controller : 'genrelistController',
      controllerAs: 'vm'
      })
      .otherwise({
        templateUrl : "genre-list/genre-list.html",
        controller : 'genrelistController',
        controllerAs: 'vm'
      });
});