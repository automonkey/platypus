var assert = require('chai').assert;
var mockery = require('mockery');

var exampleParsedOjpResponse = {
  results: [
    {scheduledDeparture: '2013-08-22T17:15:00.000+01:00', originPlatform: '5'},
    {scheduledDeparture: '2013-08-22T17:35:00.000+01:00'}
  ]
}

var ojpMock = {
  initOjpInterface: function() {
    return {
      fetchJourneyData: function() {
        return exampleParsedOjpResponse;
      }
    };
  }
};

describe('Request Processing', function() {

  var requestProcessor = null;
  before(function() {
    mockery.enable();
    mockery.registerMock('./ojp', ojpMock);
    mockery.registerAllowable('../lib/requestProcessing')
    var requestProcessing = require('../lib/requestProcessing')
    requestProcessor = requestProcessing.initRequestProcessor();
  });

  after(function() {
    mockery.disable();
  });

  it('Should return OJP results', function() {
    requestProcessor.processRequest('gtw', 'bug', function(results) {
      assert.equal(results, exampleParsedOjpResponse);
    });
  });
});

