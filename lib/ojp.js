var q = require('q');
var request = require('request');
var ojpParser = require('./ojpParser');
var generateOjpSoapRequest = require('./ojpRequestGeneration');

module.exports.initOjpInterface = function(appData) {
  return {
    fetchJourneyData: function(route) {
      var originStn = route.origin.toUpperCase();
      var destinationStn = route.destination.toUpperCase();

      var req = {
        url: 'https://ojp.nationalrail.co.uk/webservices',
        method: 'POST',
        auth: {
          user: appData.ojpCreds.user,
          password: appData.ojpCreds.password
        },
        body: generateOjpSoapRequest(originStn, destinationStn)
      };

      var defferedReturn = q.defer();
      request(req, function (error, response, body) {
        ojpParser.parseOjpResponse(body, function(err, results) {
          defferedReturn.resolve(results);
        });
      });

      return defferedReturn.promise;
    }
  };
};

