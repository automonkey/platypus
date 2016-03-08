var readEnvVar = require('./env').readEnvVar;

exports.generateAppDataFromEnvironment = function() {
  return {
    googleAnalytics: {
      trackingCode: readEnvVar('GA_TRACKING_CODE'),
      domain: readEnvVar('GA_DOMAIN')
    },
    ojpCreds: {
      user: environmentVariableOrError('OJP_USER'),
      password: environmentVariableOrError('OJP_PASS')
    }
  };
};

function environmentVariableOrError(envVar) {
  var val = readEnvVar(envVar);
  if(val !== undefined) {
    return val;
  }

  throw new Error('Missing required environment variable \'' + envVar + '\'');
}

