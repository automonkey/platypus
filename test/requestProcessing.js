var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');
var q = require('q');

chai.should();
chai.use(require('chai-things'));

var OJPResult = function() {
  var scheduledDeparture = '2013-08-22T17:15:00.000+01:00';
  var destinationStation = 'BUG';
  var originPlatform = null;

  return {
    withDestination: function(station) {
      destinationStation = station;
      return this;
    },
    withOriginPlatform: function(platform) {
      originPlatform = platform;
      return this;
    },
    build: function() {
      var res = {
        destinationStation: destinationStation,
        scheduledDeparture: scheduledDeparture
      };
      if (originPlatform !== null) {
        res.originPlatform = originPlatform;
      }
      return res;
    }
  };
};

var ojpMock = {
  initOjpInterface: function() {
    return {
      fetchJourneyData: function(route) {
        var results = [
          new OJPResult()
            .withDestination(route.destination)
            .withOriginPlatform(route.destination + '-1stResultPlat')
            .build(),
          new OJPResult()
            .withDestination(route.destination)
            .withOriginPlatform(route.destination + '-2ndResultPlat')
            .build(),
        ];
        var defferedReturn = q.defer();
        defferedReturn.resolve(results);
        return defferedReturn.promise;
      }
    };
  }
};

describe('Request Processing', function() {

  var requestProcessor = null;
  before(function() {
    mockery.enable();
    mockery.registerMock('./ojp', ojpMock);
    mockery.registerAllowable('q')
    mockery.registerAllowable('../lib/requestProcessing')
    var requestProcessing = require('../lib/requestProcessing')
    requestProcessor = requestProcessing.initRequestProcessor();
  });

  after(function() {
    mockery.disable();
  });

  it('Should return OJP results for all destinations', function(done) {
    requestProcessor.processRequest('frm', ['to1', 'to2', 'to3'], function(results) {
      assert.equal(results.length, 6);
      results.should.contain.a.thing.with.property('originPlatform', 'to1-1stResultPlat');
      results.should.contain.a.thing.with.property('originPlatform', 'to1-2ndResultPlat');
      results.should.contain.a.thing.with.property('originPlatform', 'to2-1stResultPlat');
      results.should.contain.a.thing.with.property('originPlatform', 'to2-2ndResultPlat');
      results.should.contain.a.thing.with.property('originPlatform', 'to3-1stResultPlat');
      results.should.contain.a.thing.with.property('originPlatform', 'to3-2ndResultPlat');
      done();
    });
  });

  it('Should include destination station in results', function(done) {
    requestProcessor.processRequest('frm', ['to'], function(results) {
      results.should.all.have.property('destinationStation', 'to');
      done();
    });
  });
});

