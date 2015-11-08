var parseXmlString = require('xml2js').parseString;
var xpath = require('xml2js-xpath');
var jsonPath = require('JSONPath');

var parseOjpResponse = function(ojpXmlResponse, callback) {
  parseXmlString(ojpXmlResponse, function(err, result) {
    if(err != null) {
      callback(err);
      return;
    }

    var departures = jsonPath.eval(result, '$..ns2:outwardJourney.*.ns2:timetable..ns2:scheduled..ns2:departure', {flatten: true});

    var data = {
      results: []
    };

    for(var i in departures) {
      var departure = departures[i];
      data.results.push({scheduledDeparture: departure});
    }

    callback(null, data);
  });
};

module.exports = {
  parseOjpResponse: parseOjpResponse
};

