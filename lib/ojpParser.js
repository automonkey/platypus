var parseXmlString = require('xml2js').parseString;
var xpath = require('xml2js-xpath');
var jsonPath = require('JSONPath');

var parseOjpResponse = function(ojpXmlResponse, callback) {
  parseXmlString(ojpXmlResponse, function(err, parsedXml) {
    if(err !== null) {
      callback(err);
      return;
    }

    var results = [];

    var journeys = jsonPath.eval(parsedXml, '$..ns2:outwardJourney', {flatten:true});
    for(var i in journeys) {
      var journey = journeys[i];
      var destination = jsonPath.eval(journey, '$.ns2:destination', {flatten:true})[0];
      var departure = jsonPath.eval(journey, '$.ns2:timetable..ns2:scheduled..ns2:departure', {flatten:true})[0];
      var platform = jsonPath.eval(journey, '$.ns2:leg[0].ns2:originPlatform', {flatten:true})[0];

      var result = {
        destinationStation: destination,
        scheduledDeparture: departure
      };

      if(platform) {
        result.originPlatform = platform;
      }

      results.push(result);
    }

    callback(null, results);
  });
};

module.exports = {
  parseOjpResponse: parseOjpResponse
};

