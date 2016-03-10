var readEnvVar = require('./env').readEnvVar;

exports.generateAppDataFromEnvironment = function() {
  var appData = {
    ojpCreds: {
      user: environmentVariableOrError('OJP_USER'),
      password: environmentVariableOrError('OJP_PASS')
    }
  };

  addAppDynamicsDataToAppData(appData);
  return appData;
};

function addAppDynamicsDataToAppData(data) {
  try {
    var appDynamicsData = {
      controllerHostName: environmentVariableOrError('APP_DYNAMICS_CONTROLLER_HOST_NAME'),
      accountName: environmentVariableOrError('APP_DYNAMICS_ACCOUNT_NAME'),
      accountAccessKey: environmentVariableOrError('APP_DYNAMICS_ACCOUNT_ACCESS_KEY'),
      applicationName: environmentVariableOrError('APP_DYNAMICS_APP_NAME'),
      tierName: environmentVariableOrError('APP_DYNAMICS_TIER_NAME')
    };

    data.appDynamics = appDynamicsData;
  }
  catch(err) {
  }
}

function environmentVariableOrError(envVar) {
  var val = readEnvVar(envVar);
  if(val !== undefined) {
    return val;
  }

  throw new Error('Missing required environment variable \'' + envVar + '\'');
}

