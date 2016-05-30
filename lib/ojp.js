var Promise = require('bluebird');
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

      return new Promise(function(resolve, reject) {
        request(req, function (error, response, body) {
          ojpParser.parseOjpResponse(body, function(err, results) {
            resolve(results);
          });
        });
      });
    }
  };
};

