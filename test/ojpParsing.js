var assert = require('chai').assert;
var fs = require('fs');
var ojpParsing = require('../lib/ojpParser');

var exampleOjpResponse = fs.readFileSync('./test/data/exampleOjpResponse.xml').toString();

describe('OJP Response Parsing', function() {

  var parsedData;
  before(function(done) {
    ojpParsing.parseOjpResponse(exampleOjpResponse, function(err, data) {
      parsedData = data;
      done(err);
    });
  });

  it('Should return array of trains', function() {
    assert.equal(parsedData.results.length, 2);
  });

  it('Should include scheduled departure times', function() {
    assert.equal(parsedData.results[0].scheduledDeparture, '2013-08-22T17:15:00.000+01:00');
    assert.equal(parsedData.results[1].scheduledDeparture, '2013-08-22T17:35:00.000+01:00');
  });

  it('Should include origin platform, where available', function() {
    assert.equal(parsedData.results[0].originPlatform, 5);
    assert.isUndefined(parsedData.results[1].originPlatform, 'Should only include platform element if supplied by OJP');
  });
});

