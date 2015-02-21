'use strict';

/* Services */

// service for requesting rest api
var restServices = angular.module('restServices', ['ngResource']);
var url_root = 'http://localhost:3000';

restServices.factory('BaggageOnLocation', ['$resource', 'ENV',
  function($resource, ENV){
    return $resource(ENV.apiRootUrl+'/baggage/location/:fromLoc/:toLoc', {}, {
      query: {method:'GET', params:{fromLoc:'', toLoc:''}, isArray:true},
      getMatched: {method:'GET', isArray:true}
    });
  }
]);

restServices.factory('BaggageOnId', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/baggage/id/:id');
    }
  ]
);

restServices.factory('UserProfile', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/profile');
    }
  ]
);

restServices.factory('Message', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/message');
    }
  ]
);

restServices.factory('ProviderBaggage', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/provider/:id/baggage',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('RequestorBaggage', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/requestor/:id/baggage',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('MessageOnBaggageAndProvider', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/provider/:id/baggage/:bid/message', {},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('MessageOnBaggageAndRequestor', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/requestor/:id/baggage/:bid/message',{},{get: {method:'GET', isArray:true}});
    }
  ]
);

restServices.factory('RequestorOnBaggage', ['$resource', 'ENV',
    function($resource, ENV){
      return $resource(ENV.apiRootUrl+'/baggage/:id/requestor', {},{get: {method:'GET', isArray:true}});
    }
  ]
);
