var q = require('q');
var ojp = require('./ojp');

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData, ojpRequestTracker);

  return {
    processRequest: function(origin, destinations, handler) {
      var responses = [];

      var routeRequests = q.all(destinations.map(function(destination) {
        var route = {
          origin: origin,
          destination: destination
        };

        return ojpInterface.fetchJourneyData(route);
      }));

      q.allSettled(routeRequests)
        .then(function(results) {
          var allResults = [];
          for (var i in results) {
            allResults = allResults.concat(results[i].value);
          }
          handler(allResults);
        })
    }
  }
};

