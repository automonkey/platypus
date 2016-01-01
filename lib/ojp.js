var request = require('request');
var ojpParser = require('./ojpParser');

var ojpSoapRequest = function(originStn, destinationStn) {
  var departBy = new Date().toISOString();

  return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jps="http://www.thalesgroup.com/ojp/jpdlr" xmlns:com="http://www.thalesgroup.com/ojp/common"><soapenv:Header/><soapenv:Body><jps:RealtimeJourneyPlanRequest><jps:origin><com:stationCRS>' + originStn + '</com:stationCRS> </jps:origin><jps:destination><com:stationCRS>' + destinationStn + '</com:stationCRS> </jps:destination> <jps:realtimeEnquiry>STANDARD</jps:realtimeEnquiry> <jps:outwardTime><jps:departBy>' + departBy + '</jps:departBy> </jps:outwardTime> <jps:directTrains>false</jps:directTrains></jps:RealtimeJourneyPlanRequest></soapenv:Body></soapenv:Envelope>';
}

module.exports.initOjpInterface = function(appData, ojpRequestTracker) {
  return {
    fetchJourneyData: function(route, handler) {
      var originStn = route.origin.toUpperCase();
      var destinationStn = route.destination.toUpperCase();

      var req = {
        url: 'https://ojp.nationalrail.co.uk/webservices',
        method: 'POST',
        auth: {
          user: appData.ojpCreds.user,
          password: appData.ojpCreds.password
        },
        body: ojpSoapRequest(originStn, destinationStn)
      };

      request(req, function (error, response, body) {
        ojpRequestTracker.trackOjpRequest(originStn, destinationStn);
        ojpParser.parseOjpResponse(body, function(err, results) {
          handler(results);
        });
      });
    }
  };
};

