var ojp = require('./ojp');

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData.ojpCreds, ojpRequestTracker);

  return {
    processRequest: function(origin, destination, handler) {

      var route = {
        origin: origin,
        destination: destination
      };

      ojpInterface.fetchJourneyData(route, function(results) {
        handler(results);
      });
    }
  };
};

