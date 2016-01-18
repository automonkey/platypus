var assert = require('chai').assert;
var chai = require('chai');
var mockery = require('mockery');
var q = require('q');
var anOjpResult = require('./utils/ojpResultBuilder').anOjpResult;
var ojpStub = require('./utils/ojpStub').createStubOjp();

chai.should();
chai.use(require('chai-array'));
chai.use(require('chai-things'));
chai.use(require('chai-as-promised'));

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

  describe('Result order', function() {

    it('Should sort results by date', function() {
      function dateWithHour(hour) {
        return new Date(2016, 01, 09, hour, 00, 00, 000);
      }

      ojpStub.addResult('bug', anOjpResult()
        .withScheduledDepartureTime(dateWithHour(10))
        .withDestination('10am').build());

      ojpStub.addResult('wvf', anOjpResult()
        .withScheduledDepartureTime(dateWithHour(11))
        .withDestination('11am').build());

      ojpStub.addResult('btn', anOjpResult()
        .withScheduledDepartureTime(dateWithHour(09))
        .withDestination('9am').build());

      var results = requestProcessor.processRequest('frm', ['bug', 'wvf', 'btn'])
      return Promise.all([
        results.should.eventually.have.firstValue.with.property('destinationStation', '9am'),
        results.should.eventually.have.secondValue.with.property('destinationStation', '10am'),
        results.should.eventually.have.thirdValue.with.property('destinationStation', '11am')
      ]);
    });

    describe('When dates are equal', function() {
      var testDate = new Date();

      function addResultForDestination(destination) {
        // all results returned from same request to avoid order of response affecting result
        ojpStub.addResult('1st-priority', anOjpResult()
          .withScheduledDepartureTime(testDate)
          .withDestination(destination).build());
      }

      it('Should prioritize by order of listed destinations (case insensitive)', function() {

        addResultForDestination('1ST-PRIORITY');
        addResultForDestination('2nd-priority');
        addResultForDestination('3RD-PRIORITY');
        addResultForDestination('3RD-PRIORITY');
        addResultForDestination('2nd-priority');
        addResultForDestination('1ST-PRIORITY');

        var results = requestProcessor.processRequest('frm', ['1st-priority', '2ND-PRIORITY', '3rd-priority']);
        return Promise.all([
          results.should.eventually.have.atIndex(0).with.property('destinationStation', '1ST-PRIORITY'),
          results.should.eventually.have.atIndex(1).with.property('destinationStation', '1ST-PRIORITY'),
          results.should.eventually.have.atIndex(2).with.property('destinationStation', '2nd-priority'),
          results.should.eventually.have.atIndex(3).with.property('destinationStation', '2nd-priority'),
          results.should.eventually.have.atIndex(4).with.property('destinationStation', '3RD-PRIORITY'),
          results.should.eventually.have.atIndex(5).with.property('destinationStation', '3RD-PRIORITY'),
        ]);
      });

      it('Should make unlisted destinations lowest priority', function() {

        // User may have entered the CRC for a 'station group' as one of the
        // destinations, in which case some result destinations may not be
        // listed in the requested destinations. Prioritise exact matches.

        addResultForDestination('unlisted');
        addResultForDestination('1st-priority');
        addResultForDestination('unlisted');

        var results = requestProcessor.processRequest('frm', ['1st-priority']);
        return Promise.all([
          results.should.eventually.have.firstValue.with.property('destinationStation', '1st-priority'),
          results.should.eventually.have.secondValue.with.property('destinationStation', 'unlisted'),
          results.should.eventually.have.thirdValue.with.property('destinationStation', 'unlisted'),
        ]);
      });
    });
  });
});

