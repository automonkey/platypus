var InputError = require('./inputError');
var ojp = require('./ojp');
var Promise = require('bluebird');
var processOjpResults = require('./ojpResultProcessing').processOjpResults;

exports.initRequestProcessor = function(appData) {

  var ojpInterface = ojp.initOjpInterface(appData);

  return {
    processRequest: function(origin, destinations) {
      var responses = [];

      if (destinations.length > 3) {
        return Promise.reject(new InputError('Too many destinations'));
      }

      return Promise.all(routeRequests(origin, destinations))
      .then(function(results) {
        var allResults = [];
        for (var i in results) {
          allResults = allResults.concat(results[i]);
        }

        return processOjpResults(destinations, allResults);
      });
    }
  };

  function routeRequests(origin, destinations) {
    return destinations.map(function(destination) {
      var route = {
        origin: origin,
        destination: destination
      };

      return ojpInterface.fetchJourneyData(route);
    });
  }
};

