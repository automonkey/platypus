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

var ojpStub = {
  stubOjpResults: {},

  addResult: function(destination, ojpResult) {
    if (this.stubOjpResults.hasOwnProperty(destination) === false) {
      this.stubOjpResults[destination] = [];
    }
    this.stubOjpResults[destination].push(ojpResult);
  },

  resetStubResults: function() {
    for (var member in this.stubOjpResults) {
      delete this.stubOjpResults[member];
    }
  },

  initOjpInterface: function() {
    var stubRes = this.stubOjpResults;
    return {
      fetchJourneyData: function(route) {
        var defferedReturn = q.defer();
        defferedReturn.resolve(stubRes[route.destination] || []);
        return defferedReturn.promise;
      }
    };
  }
};

describe('Request Processing', function() {

  var requestProcessor = null;
  before(function() {
    mockery.enable();
    mockery.registerMock('./ojp', ojpStub);
    mockery.registerAllowable('q')
    mockery.registerAllowable('../lib/requestProcessing')
    var requestProcessing = require('../lib/requestProcessing')
    requestProcessor = requestProcessing.initRequestProcessor();
  });

  after(function() {
    mockery.disable();
  });

  afterEach(function() {
    ojpStub.resetStubResults();
  });

  it('Should return OJP results for all destinations', function(done) {
    ojpStub.addResult('to1', new OJPResult().withOriginPlatform('1').build());
    ojpStub.addResult('to1', new OJPResult().withOriginPlatform('2').build());
    ojpStub.addResult('to2', new OJPResult().withOriginPlatform('3').build());
    ojpStub.addResult('to2', new OJPResult().withOriginPlatform('4').build());
    ojpStub.addResult('to3', new OJPResult().withOriginPlatform('5').build());
    ojpStub.addResult('to3', new OJPResult().withOriginPlatform('6').build());

    requestProcessor.processRequest('frm', ['to1', 'to2', 'to3'], function(results) {
      assert.equal(results.length, 6);
      results.should.contain.a.thing.with.property('originPlatform', '1');
      results.should.contain.a.thing.with.property('originPlatform', '2');
      results.should.contain.a.thing.with.property('originPlatform', '3');
      results.should.contain.a.thing.with.property('originPlatform', '4');
      results.should.contain.a.thing.with.property('originPlatform', '5');
      results.should.contain.a.thing.with.property('originPlatform', '6');
      done();
    });
  });

  it('Should include destination station in results', function(done) {
    ojpStub.addResult('to', new OJPResult().withDestination('to').build());

    requestProcessor.processRequest('frm', ['to'], function(results) {
      assert.equal(results.length, 1);
      results.should.all.have.property('destinationStation', 'to');
      done();
    });
  });
});

