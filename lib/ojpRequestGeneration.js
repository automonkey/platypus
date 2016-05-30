var escapeXml = require('xml-escape');

module.exports = function(originStn, destinationStn) {
  var departBy = new Date().toISOString();

  return '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jps="http://www.thalesgroup.com/ojp/jpdlr" xmlns:com="http://www.thalesgroup.com/ojp/common"><soapenv:Header/><soapenv:Body><jps:RealtimeJourneyPlanRequest><jps:origin><com:stationCRS>' + escapeXml(originStn) + '</com:stationCRS> </jps:origin><jps:destination><com:stationCRS>' + escapeXml(destinationStn) + '</com:stationCRS> </jps:destination> <jps:realtimeEnquiry>STANDARD</jps:realtimeEnquiry> <jps:outwardTime><jps:departBy>' + departBy + '</jps:departBy> </jps:outwardTime> <jps:directTrains>false</jps:directTrains></jps:RealtimeJourneyPlanRequest></soapenv:Body></soapenv:Envelope>';
};

