'use strict';

/* jasmine specs for controllers go here */
describe('fliggage controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('myApp'));
  beforeEach(module('restServices'));

  describe('BaggageListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://chinesemonster.serveblog.net:3000/baggage').
          respond([{"_id":"1","from":"Chengdu, Sichuan, China","accesptBefore":1423642800000,"to":"Espoo, Finland","arriveAfter":1423801200000,"weight":15,"info":"15","uid":"1","time":"2015-02-22T21:09:27.951Z","space":[15,15,15],"providerName":"test1","providerImage":"https://someurl"},
          {"_id":"2","from":"Espoo, Finland","to":"Deyang, Sichuan, China","weight":10,"info":"nothing","uid":"2","time":"2015-02-22T21:09:27.948Z","space":[10,10,10],"providerName":"test2","providerImage":"https://someurl"}]);

      scope = $rootScope.$new();
      ctrl = $controller('BaggageListCtrl', {$scope: scope});
    }));


    it('should create "baggages" model with 2 baggages fetched from xhr', function() {
      expect(scope.baggages).toEqualData([]);
      $httpBackend.flush();

      expect(scope.baggages).toEqualData(
          [{"_id":"1","from":"Chengdu, Sichuan, China","accesptBefore":1423642800000,"to":"Espoo, Finland","arriveAfter":1423801200000,"weight":15,"info":"15","uid":"1","time":"2015-02-22T21:09:27.951Z","space":[15,15,15],"providerName":"test1","providerImage":"https://someurl"},
          {"_id":"2","from":"Espoo, Finland","to":"Deyang, Sichuan, China","weight":10,"info":"nothing","uid":"2","time":"2015-02-22T21:09:27.948Z","space":[10,10,10],"providerName":"test2","providerImage":"https://someurl"}]);
    });


  });


});




