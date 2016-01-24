exports.generateAppDataFromEnvironment = function() {
  return {
    googleAnalytics: {
      trackingCode: process.env.GA_TRACKING_CODE,
      domain: process.env.GA_DOMAIN
    },
    ojpCreds: {
      user: environmentVariableOrError('OJP_USER'),
      password: environmentVariableOrError('OJP_PASS')
    }
  };
}

function environmentVariableOrError(envVar) {
  var val = process.env[envVar];
  if(val != null) {
    return val;
  }

  throw new Error('Missing required environment variable \'' + envVar + '\'');
};

