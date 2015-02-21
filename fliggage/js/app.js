'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'appControllers',
  'appDirectives',
  'restServices',
  'ngStorage',
  'ui.bootstrap.datetimepicker',
  'ngDialog',
  'envconfig'
]).config(['$routeProvider', '$httpProvider', 'ngDialogProvider',
  function($routeProvider, $httpProvider, ngDialogProvider) {
    $routeProvider.
      when('/signin', {
        templateUrl: 'view/signin.html',
        controller: 'SigninCtrl'
      }).
      when('/signed-in/:token', {
        templateUrl: 'view/signed-in.html',
        controller: 'GetUserCtrl'
      }).
      when('/home', {
        templateUrl: 'view/baggage-list.html',
        controller: 'BaggageListCtrl'
      }).
      when('/about', {
        templateUrl: 'view/about.html'
      }).
      when('/baggage/:baggageId', {
        templateUrl: 'view/baggage-detail.html',
        controller: 'BaggageDetailCtrl'
      }).
      when('/post-offer', {
        templateUrl: 'view/post-offer.html',
        controller: 'BaggagePostOfferCtrl'
      }).
      when('/dashboard', {
        templateUrl: 'view/dashboard.html',
        controller: 'DashboardCtrl'
      }).
      when('/account', {
        templateUrl: 'view/account.html',
        controller: 'AccountCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
          'request': function (config) {
            config.headers = config.headers || {};
            if ($localStorage.token) {
              config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }
            return config;
          },
          'responseError': function(response) {
            if(response.status === 401 || response.status === 403) {
              $location.path('/signin');
            }
            return $q.reject(response);
          }
        };
      }
    ]);
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default width600',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
  }
]);
