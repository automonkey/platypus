var OjpResult = function() {
  var destinationStation = 'BUG';
  var scheduledDeparture = '2013-08-22T17:15:00.000+01:00';
  var originPlatform = null;

  return {
    withDestination: function(station) {
      destinationStation = station;
      return this;
    },
    withScheduledDepartureTime: function(departureTime) {
      scheduledDeparture = departureTime.toISOString();
      return this;
    },
    withOriginPlatform: function(platform) {
      originPlatform = platform;
      return this;
    },
    build: function() {
      var res = {
        destinationStation: destinationStation,
        scheduledDeparture: scheduledDeparture
      };
      if (originPlatform !== null) {
        res.originPlatform = originPlatform;
      }
      return res;
    }
  };
};

module.exports.anOjpResult = function() {
  return new OjpResult();
};

