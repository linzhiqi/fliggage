'use strict';

/* Services */

var restServices = angular.module('restServices', ['ngResource']);


restServices.factory('Baggage', ['$resource',
  function($resource){
    return $resource('http://localhost:3000/baggage/:fromLoc/:toLoc', {}, {
      query: {method:'GET', params:{fromLoc:'', toLoc:''}, isArray:true},
      getMatched: {method:'GET', isArray:true}
    });
  }]);
