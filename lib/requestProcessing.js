var ojp = require('./ojp');
var ojpParser = require('./ojpParser');

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData.ojpCreds, ojpRequestTracker);

  return {
    processRequest: function(origin, destination, handler) {

      var route = {
        origin: origin,
        destination: destination
      };

      ojpInterface.fetchJourneyData(route, function(response) {
        ojpParser.parseOjpResponse(response, function(err, results) {
          handler(results);
        });
      });
    }
  };
};

