var chai = require('chai');
var mockery = require('mockery');
var Promise = require('bluebird');
var q = require('q');
var anOjpResult = require('./utils/ojpResultBuilder').anOjpResult;
var ojpStub = require('./utils/ojpStub').createStubOjp();

chai.should();
chai.use(require('chai-array'));
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

var ojpResultProcessingStub = {
  processOjpResults: function(destinations, results) {
    return results.map(function(result) {
      result['was-processed-with-destinations'] = destinations;
      return result;
    });
  }
};

describe('Request Processing', function() {

  var requestProcessor = null;
  before(function() {
    mockery.enable();
    mockery.registerMock('./ojp', ojpStub);
    mockery.registerMock('./ojpResultProcessing', ojpResultProcessingStub);
    mockery.registerAllowable('q')
    mockery.registerAllowable('../../lib/requestProcessing')
    var requestProcessing = require('../../lib/requestProcessing')
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

  it('Should return processed results', function() {
    var requestedDestination = 'DST';
    var resultDestination = 'OTHR';
    ojpStub.addResult(requestedDestination, anOjpResult().withDestination(resultDestination).build());

    var requestedDestinationArray = [ requestedDestination ];
    var results = requestProcessor.processRequest('frm', requestedDestinationArray);
    return Promise.all([
      results.should.eventually.not.be.empty,
      results.should.eventually.all.have.property('was-processed-with-destinations', requestedDestinationArray)
    ]);
  });
});

