var q = require('q');
var InputError = require('./inputError');
var ojp = require('./ojp');
var processOjpResults = require('./ojpResultProcessing').processOjpResults;

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData, ojpRequestTracker);

  return {
    processRequest: function(origin, destinations) {
      var responses = [];

      if (destinations.length > 3) {
        return Promise.reject(new InputError('Too many destinations'));
      }

      var routeRequests = q.all(destinations.map(function(destination) {
        var route = {
          origin: origin,
          destination: destination
        };

        return ojpInterface.fetchJourneyData(route);
      }));

      return q.allSettled(routeRequests)
      .then(function(results) {
        var allResults = [];
        for (var i in results) {
          allResults = allResults.concat(results[i].value);
        }

        return processOjpResults(destinations, allResults);
      });
    }
  };
};

