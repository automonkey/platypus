var app = require('./lib/app');

var environmentVariableOrExit = function(envVar) {
  var val = process.env[envVar];
  if(val != null) {
    return val;
  }

  console.log('Missing required environment variable \'' + envVar + '\'');
  process.exit();
};

var port = process.env.PORT || 3000;

var appData = {
  googleAnalytics: {
    trackingCode: process.env.GA_TRACKING_CODE,
    domain: process.env.GA_DOMAIN
  },
  ojpCreds: {
    user: environmentVariableOrExit('OJP_USER'),
    password: environmentVariableOrExit('OJP_PASS')
  }
};

var server = app(appData).listen(port, function() {
});

