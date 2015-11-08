var NA = require('nodealytics');

module.exports.initOjpRequestTracker = function(appData) {
  var gaData = appData.googleAnalytics;
  var gaTrackingCode = gaData.trackingCode;
  var gaDomain = gaData.domain;

  if(gaTrackingCode == null || gaDomain == null) {
    console.log('warning: No Google Analytics configuration data (OJP request tracking is disabled)');

    return {
      trackOjpRequest: function(originStn, destinationStn) {
      }
    };
  }

  NA.initialize(gaTrackingCode, gaDomain);

  return {
    trackOjpRequest: function(originStn, destinationStn) {
      NA.trackEvent('OJP', 'Request', originStn + ' -> ' + destinationStn);
    }
  };
};

