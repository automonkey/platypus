exports.processOjpResults = function(requestedDestinations, results) {

  var orderByDestination = orderByDestinationFunction(requestedDestinations);
  results.sort(function(a, b) {
    if (a.scheduledDeparture < b.scheduledDeparture) return -1;
    else if (a.scheduledDeparture > b.scheduledDeparture) return 1;
    return orderByDestination(a, b);
  });

  return results;

  function orderByDestinationFunction(dests) {
    var requestedDestinations = dests.map(function(destination) {
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
};

