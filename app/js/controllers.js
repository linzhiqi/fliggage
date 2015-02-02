'use strict';

/* Controllers */

var appControllers = angular.module('appControllers', []);

appControllers.controller('BaggagesCtrl', ['$scope', 'Baggage',
  function($scope, Baggage) {
    var defaultBaggages= [
      {fromLoc: 'Deyang, Sichuan, China',
       toLoc: 'Helsinki, Finland' 
      },
      {fromLoc: 'Deyang, Sichuan, China',
       toLoc: 'Helsinki, Finland' 
      },
      {fromLoc: 'Deyang, Sichuan, China',
       toLoc: 'Helsinki, Finland' 
      },
      {fromLoc: 'Deyang, Sichuan, China',
       toLoc: 'Helsinki, Finland' 
      }
    ];
    $scope.baggages = Baggage.query();
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
      console.log(fromStruct);
      for(var i in fromStruct){
        fromStruct[i]=fromStruct[i].trim();
      };
      console.log(fromStruct);
      toStruct = $scope.to.split(',');
      for(var i in toStruct){
        toStruct[i]=toStruct[i].trim();
      };
      
      var curFrom0 = fromStruct[0];
      var curTo0 = toStruct[0];


      console.log('from0:'+curFrom0+' to0:'+curTo0);
      Baggage.getMatched({fromLoc: curFrom0, toLoc:curTo0}, function(baggages) {
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
          Baggage.getMatched({fromLoc: curFrom1, toLoc:curTo1}, function(baggages) {
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
              Baggage.getMatched({fromLoc: curFrom2, toLoc:curTo2}, function(baggages) {
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
}]);


