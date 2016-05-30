var assert = require('chai').assert;
var libxml = require('libxmljs');
var request = require('../../lib/ojpRequestGeneration');

describe('OJP Request Generation', function() {

  it('Should generate valid XML', function() {
    assert.isOk(isValidXml(request('BUG', 'BTN')));
  });

  describe('Should protect against XML in entered station names', function() {

    it('origin station', function() {
      assert.isOk(isValidXml(request('BUG<some-menacing-xml-tag>', 'BTN')));
    });

    it('destination station', function() {
      assert.isOk(isValidXml(request('BUG', 'BTN<some-menacing-xml-tag>')));
    });

  });

});

function isValidXml(request) {
  try {
    libxml.parseXml(request);
  }
  catch (e) {
    return false;
  }

  return true;
}

