var q = require('q');
var ojp = require('./ojp');
var Promise = require('bluebird');
var processOjpResults = require('./ojpResultProcessing').processOjpResults;

exports.initRequestProcessor = function(appData, ojpRequestTracker) {

  var ojpInterface = ojp.initOjpInterface(appData, ojpRequestTracker);

  return {
    processRequest: function(origin, destinations) {
      var responses = [];

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

