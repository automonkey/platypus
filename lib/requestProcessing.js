var q = require('q');
var ojp = require('./ojp');

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

        var orderByDestination = orderByDestinationFunction(destinations);
        allResults.sort(function(a, b) {
          if (a.scheduledDeparture < b.scheduledDeparture) return -1;
          else if (a.scheduledDeparture > b.scheduledDeparture) return 1;
          return orderByDestination(a, b);
        });

        return allResults;
      })

      function orderByDestinationFunction(dests) {
        var requestedDestinations = destinations.map(function(destination) {
          return destination.toUpperCase();
        });
        return function(a, b) {
          var indexOfA = destinationSortValue(a);
          var indexOfB = destinationSortValue(b);

          if (indexOfA < indexOfB) return -1;
          else if (indexOfA > indexOfB) return 1;
          return 0;

          function destinationSortValue(a) {
            var LOW_PRIORITY = 300;
            var index = requestedDestinations.indexOf(a.destinationStation.toUpperCase());
            return index === -1 ? LOW_PRIORITY : index;
          }
        }
      }
    }
  }
};

