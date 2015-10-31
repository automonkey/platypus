var request = require('request');

var ojpSoapRequest = function(route) {
  var originStn = route.origin.toUpperCase();
  var destinationStn = route.destination.toUpperCase();
  var departBy = new Date().toISOString();

  return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jps="http://www.thalesgroup.com/ojp/jpdlr" xmlns:com="http://www.thalesgroup.com/ojp/common"><soapenv:Header/><soapenv:Body><jps:RealtimeJourneyPlanRequest><jps:origin><com:stationCRS>' + originStn + '</com:stationCRS> </jps:origin><jps:destination><com:stationCRS>' + destinationStn + '</com:stationCRS> </jps:destination> <jps:realtimeEnquiry>STANDARD</jps:realtimeEnquiry> <jps:outwardTime><jps:departBy>' + departBy + '</jps:departBy> </jps:outwardTime> <jps:directTrains>false</jps:directTrains></jps:RealtimeJourneyPlanRequest></soapenv:Body></soapenv:Envelope>';
}

var fetchJourneyData = function(ojpCreds, route, handler) {
  var req = {
    url: 'https://ojp.nationalrail.co.uk/webservices',
    method: 'POST',
    auth: {
      user: ojpCreds.user,
      password: ojpCreds.password
    },
    body: ojpSoapRequest(route)
  };

  request(req, function (error, response, body) {
    handler(body);
  });
};

module.exports = {
  fetchJourneyData: fetchJourneyData
};

