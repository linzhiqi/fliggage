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

restServices.factory('Message', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/message');
    }
  ]
);

restServices.factory('ProviderBaggage', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/provider/:id/baggage',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('RequestorBaggage', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/requestor/:id/baggage',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('MessageOnBaggageAndProvider', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/provider/:id/baggage/:bid/message', {},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('MessageOnBaggageAndRequestor', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/requestor/:id/baggage/:bid/message',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('RequestorOnBaggage', ['$resource',
    function($resource){
      return $resource('http://localhost:3000/baggage/:id/requestor', {},{get: {method:'GET', isArray:true}});
    }
  ]
);
