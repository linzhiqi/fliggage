'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('HeaderCtrl', ['$scope', '$rootScope', '$location','$localStorage',
  function($scope, $rootScope, $location, $localStorage) {
    if($localStorage.token && $localStorage.profile) {
      console.log('localstorage is true.');
      $rootScope.signedIn = true;
      $rootScope.userName = $localStorage.profile.name;
      $rootScope.userImage = $localStorage.profile.image;  
      $rootScope.userId = $localStorage.profile._id;
    }

    $scope.logout = function() {
      delete $localStorage.profile;
      delete $localStorage.token;
      $rootScope.signedIn = false;
      $rootScope.userName ='';
      $rootScope.userImage = '';
      $rootScope.userId = '';
    };
  }]
);

appControllers.controller('BaggageListCtrl', ['$scope', 'BaggageOnLocation',
  function($scope, BaggageOnLocation) {
   
    $scope.baggages = BaggageOnLocation.query();
    console.log("BaggageListCtrl triggered.");
    console.log($scope.baggages);
    //$scope.baggages = defaultBaggages;
    $scope.orderProp = 'age';
    var fromStruct = [];
    var toStruct = [];
    var round1 = [];
    var round2 = [];

    $scope.searchBaggages = function() {
      $scope.$broadcast('event:force-model-update');
      console.log('from '+$scope.from+' to '+$scope.to);
      $scope.baggages=[];
  
      fromStruct = $scope.from.split(',');
      for(var i in fromStruct){
        fromStruct[i]=fromStruct[i].trim();
      };

      toStruct = $scope.to.split(',');
      for(var i in toStruct){
        toStruct[i]=toStruct[i].trim();
      };
      
      var curFrom0 = fromStruct[0];
      var curTo0 = toStruct[0];


      console.log('from0:'+curFrom0+' to0:'+curTo0);
      BaggageOnLocation.getMatched({fromLoc: curFrom0, toLoc:curTo0}, function(baggages) {
        Array.prototype.push.apply($scope.baggages,baggages);
        var changed1 = false;
        var curFrom1 = curFrom0;
        var curTo1 = curTo0;
        if (fromStruct.length>1 && fromStruct[1]) {
          curFrom1 = fromStruct[1];
          changed1 = true;
        }

        if (toStruct.length>1 && toStruct[1]) {
          curTo1 = toStruct[1];
          changed1 = true;
        }
        if (changed1 === true) {
          console.log('from1:'+curFrom1+' to1:'+curTo1);
          BaggageOnLocation.getMatched({fromLoc: curFrom1, toLoc:curTo1}, function(baggages) {
            Array.prototype.push.apply(round1,baggages);
            mergeBaggage($scope.baggages,round1);
            
            var changed2 = false;
            var curFrom2 = curFrom1;
            var curTo2 = curTo1;
            if (fromStruct.length>2 && fromStruct[2]) {
              curFrom2 = fromStruct[2];
              changed2 = true;
            }
            if (toStruct.length>2 && toStruct[2]) {
              curTo2 = toStruct[2];
              changed2 = true;
            }
            if (changed2 === true) {
              console.log('from2:'+curFrom2+' to2:'+curTo2);
              BaggageOnLocation.getMatched({fromLoc: curFrom2, toLoc:curTo2}, function(baggages) {
                Array.prototype.push.apply(round2,baggages);
                mergeBaggage($scope.baggages,round2);
              });
            }
          });
        }
      });
    };

    function mergeBaggage(to, from) {
      var squeezed = [];
      from.map(function(baggage){
        var contained = false;
        for(var i in to) {
	  if(to[i]._id === baggage._id) {
            contained = true;
            break;
          }
        }
        if(contained === false) squeezed.push(baggage); 
      });
      Array.prototype.push.apply(to, squeezed);
    }

    setAutoComplete();


}]);

function setAutoComplete() {
 // initialize google place autocomplete

    var autocomplete_from;
    var autocomplete_to;
    var countryRestrict = {};
    var place_type_filter = '(cities)';

  function onFromPlaceChanged() {
    if(autocomplete_from){
      var place = autocomplete_from.getPlace();
      var formatted_address = place.formatted_address;
      console.log(formatted_address);
      document.getElementById('fromLocationInput').value=formatted_address;
    }
  }
  function onToPlaceChanged() {
    if(autocomplete_to){
      var place = autocomplete_to.getPlace();
      var formatted_address = place.formatted_address;
      console.log(formatted_address);
      document.getElementById('toLocationInput').value=formatted_address;
    }
  }

    var autoCompleteInit =function initialize() {

    autocomplete_from = new google.maps.places.Autocomplete(document.getElementById('fromLocationInput'), {
      types: [ place_type_filter ],
      componentRestrictions: countryRestrict
    });
    autocomplete_from.setComponentRestrictions([]);
    autocomplete_to = new google.maps.places.Autocomplete(document.getElementById('toLocationInput'), {
      types: [ place_type_filter ],
      componentRestrictions: countryRestrict
    });

    google.maps.event.addListener(autocomplete_from, 'place_changed', onFromPlaceChanged);
    
    google.maps.event.addListener(autocomplete_to, 'place_changed', onToPlaceChanged);
  }();

};


appControllers.controller('BaggageDetailCtrl', ['$scope', 'BaggageOnId', '$routeParams', 'ngDialog',
  function($scope, BaggageOnId, $routeParams, ngDialog) {

    $scope.baggageId = $routeParams.baggageId;
    
    BaggageOnId.get({id: $scope.baggageId}, function(baggage) {
      console.log('this baggage: '+JSON.stringify(baggage));
      $scope.baggage = baggage;
      $scope.providerId = baggage.uid;
    });
    
    $scope.contactProvider = function() {
      ngDialog.open({
        template: './view/message.html',
        controller: 'ContactCtrl',
        scope: $scope
      });
    };
  }
]);

appControllers.controller('ContactCtrl', ['$scope', '$rootScope', '$location', 'Message', 'MessageOnBaggageAndRequestor', 'ngDialog',
  function($scope, $rootScope, $location, Message, MessageOnBaggageAndRequestor, ngDialog) {
    var requestorId = $rootScope.userId===$scope.$parent.currProviderId?$scope.$parent.currToId:$rootScope.userId;
    $scope.currToRole = $scope.$parent.currToId===$scope.$parent.currProviderId?'provider':'requestor';
    $scope.currToName = $scope.$parent.currToName;
    MessageOnBaggageAndRequestor.get({id: requestorId, bid: $scope.$parent.currBaggageId}, function(messages){
      $scope.messages = messages;
      console.log("msgs:"+JSON.stringify(messages));
    });

    $scope.sendMessage = function() {
      $scope.msg.baggageId = $scope.$parent.currBaggageId;
      $scope.msg.fromId = $rootScope.userId;
      $scope.msg.toId = $scope.$parent.currToId;
      $scope.msg.isFromRequestor = ($rootScope.userId!==$scope.$parent.currProviderId);
      console.log("message from "+ $scope.msg.isFromRequestor===true?'requestoer':'provider');
      Message.save($scope.msg, function(data){
        console.log('msg return: '+JSON.stringify(data));
       // alert('message is sent');
        
      });
      return true;
    };
  }
]);

appControllers.controller('BaggageDetailCtrl', ['$scope', '$rootScope', '$location', 'BaggageOnId', '$routeParams', 'ngDialog',
  function($scope, $rootScope, $location, BaggageOnId, $routeParams, ngDialog) {

    $scope.currBaggageId = $routeParams.baggageId;
    
    BaggageOnId.get({id: $scope.currBaggageId}, function(baggage) {
      console.log('this baggage: '+JSON.stringify(baggage));
      $scope.baggage = baggage;
      $scope.currProviderId = baggage.uid;
      $scope.currToId = baggage.uid;
      $scope.currToName = baggage.providerName;
    });
    
    $scope.contactProvider = function() {
      if(!$rootScope.signedIn){
        $location.path('/signin');
        return;
      } 
      ngDialog.open({
        template: './view/message.html',
        controller: 'ContactCtrl',
        scope: $scope
      });
    };
  }
]);

appControllers.controller('DashboardCtrl', ['$scope', '$rootScope', 'ProviderBaggage', 'RequestorOnBaggage', 'RequestorBaggage', 'ngDialog',
  function($scope, $rootScope, ProviderBaggage, RequestorOnBaggage, RequestorBaggage, ngDialog) {

    $scope.offerList = [];
    ProviderBaggage.get({id: $rootScope.userId}, function(baggages) {
      $scope.offerList = baggages;
      for(var i in $scope.offerList){
        (function(index){
          RequestorOnBaggage.get({id: $scope.offerList[index]._id}, function(requestors){
            $scope.offerList[index].requestors = requestors;
          });
        }(i));
      }
    });
    $scope.requestList = [];
    RequestorBaggage.get({id: $rootScope.userId}, function(baggages) {
      $scope.requestList = baggages;
    });
    
    $scope.contactRequestor = function(baggageId, requestorName, requestorId) {
      $scope.currBaggageId = baggageId;
      $scope.currToId = requestorId;
      $scope.currProviderId = $rootScope.userId;
      $scope.currToName = requestorName;
      ngDialog.open({
        template: './view/message.html',
        controller: 'ContactCtrl',
        scope: $scope
      });
    };

    $scope.contactProvider = function(baggageId, providerName, providerId) {
      $scope.currBaggageId = baggageId;
      $scope.currToId = providerId;
      $scope.currProviderId = providerId;
      $scope.currToName = providerName;
      ngDialog.open({
        template: './view/message.html',
        controller: 'ContactCtrl',
        scope: $scope
      });
    };
  }
]);

appControllers.controller('BaggagePostOfferCtrl', ['$scope', 'BaggageOnId', '$location','$localStorage',
  function($scope, BaggageOnId, $location, $localStorage) {
    if(!$localStorage.token || !$localStorage.profile){
      alert('Posting offer requires signin.');
      $location.path('/signin');
      return;
    }

    $scope.onAcceptBeforeTimeSet = function(newDate, oldDate){
      console.log('AcceptBefore:'+newDate);
      $scope.baggage.accesptBefore = Date.parse(newDate);
    }

    $scope.onArriveAfterTimeSet = function(newDate, oldDate){
       console.log('ArriveAfter:'+newDate);
       $scope.baggage.arriveAfter = Date.parse(newDate);
    }

    $scope.baggage={space: []};
    setAutoComplete();
    $scope.postBaggage = function() {
      $scope.$broadcast('event:force-model-update');
      $scope.baggage.space[0]=$scope.length;
      $scope.baggage.space[1]=$scope.width;
      $scope.baggage.space[2]=$scope.height;
      $scope.baggage.uid=$localStorage.profile._id;
      console.log('posting baggage: '+JSON.stringify($scope.baggage));
      BaggageOnId.save(JSON.stringify($scope.baggage), function(){
        console.log('posted baggage: '+JSON.stringify($scope.baggage));
        alert('baggage is saved.');
        $location.path('');
      });
    }
  }
]);

/*
appControllers.controller('SignInCtrl', ['$scope', 'SignInGoogle', '$localStorage',
  function($scope, SignInGoogle, $localStorage) {
    $scope.signInGoogle = function(){
      SignInGoogle.get( function(token) {
      console.log('token: '+token);
      $localStorage.token = token;
    });}
  }
]);
*/


appControllers.controller('GetUserCtrl', ['$scope', '$rootScope', '$localStorage', '$routeParams','$location', 'UserProfile',
  function($scope, $rootScope, $localStorage, $routeParams, $location, UserProfile) {
    console.log('token: '+$routeParams.token);
    $localStorage.token = $routeParams.token;
    UserProfile.get({}, function(user){
      $localStorage.profile = user;
      $rootScope.signedIn = true;
      $rootScope.userName = user.name;
      $rootScope.userImage = user.image;
      $rootScope.userId = user._id;
    });
    $location.path('');
  }
]);

appControllers.controller('SigninCtrl', ['$scope', 'ENV',
  function($scope, ENV) {
    console.log("EVN:"+ENV);
    //$scope.api-root-url = ENV.api-root-url;
  }
]);

