var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');
var q = require('q');
var anOjpResult = require('./ojpResultBuilder').anOjpResult;

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

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

  it('Should return OJP results for all destinations', function() {
    ojpStub.addResult('to1', anOjpResult().withOriginPlatform('1').build());
    ojpStub.addResult('to1', anOjpResult().withOriginPlatform('2').build());
    ojpStub.addResult('to2', anOjpResult().withOriginPlatform('3').build());
    ojpStub.addResult('to2', anOjpResult().withOriginPlatform('4').build());
    ojpStub.addResult('to3', anOjpResult().withOriginPlatform('5').build());
    ojpStub.addResult('to3', anOjpResult().withOriginPlatform('6').build());

    var results = requestProcessor.processRequest('frm', ['to1', 'to2', 'to3']);
    return Promise.all([
      results.should.eventually.have.length(6),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '1'),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '2'),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '3'),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '4'),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '5'),
      results.should.eventually.contain.a.thing.with.property('originPlatform', '6')
    ]);
  });

  it('Should include destination station in results', function() {
    ojpStub.addResult('to', anOjpResult().withDestination('to').build());

    var results = requestProcessor.processRequest('frm', ['to']);
    return Promise.all([
      results.should.eventually.not.be.empty,
      results.should.eventually.all.have.property('destinationStation', 'to')
    ]);
  });
});

