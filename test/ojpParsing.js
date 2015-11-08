var assert = require('assert');
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

  it('Should report scheduled departure times', function() {
    assert.equal(parsedData.results[0].scheduledDeparture, '2009-09-04T10:49:00.000+01:00')
    assert.equal(parsedData.results[1].scheduledDeparture, '2009-09-04T11:02:00.000+01:00')
  });
});

