'use strict';

/* Services */

// service for requesting rest api
var restServices = angular.module('restServices', ['ngResource']);

restServices.factory('BaggageOnLocation', ['$resource',
  function($resource){
    return $resource('http://localhost:3000/baggage/location/:fromLoc/:toLoc', {}, {
      query: {method:'GET', params:{fromLoc:'', toLoc:''}, isArray:true},
      getMatched: {method:'GET', isArray:true}
    });
  }
]);

restServices.factory('BaggageOnId', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/baggage/id/:id');
    }
  ]
);

restServices.factory('UserProfile', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/profile');
    }
  ]
);


