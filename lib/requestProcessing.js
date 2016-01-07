var ojp = require('./ojp');

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData, ojpRequestTracker);

  return {
    processRequest: function(origin, destinations, handler) {
      var responses = [];

      for (var i in destinations) {
        var route = {
          origin: origin,
          destination: destinations[i]
        };

        ojpInterface.fetchJourneyData(route, function(results) {
          responses.push(results);

          if (responses.length === destinations.length) {
            var allResults = [];
            for (response in responses) {
              allResults = allResults.concat(responses[response]);
            }

            handler(allResults);
          }
        });
      }
    }
  };
};

