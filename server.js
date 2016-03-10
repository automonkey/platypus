var appData = require('./lib/appData').generateAppDataFromEnvironment();

if (appData.appDynamics) {
  require("appdynamics").profile({
    controllerHostName: appData.appDynamics.controllerHostName,
    controllerPort: 443,
    controllerSslEnabled: true,
    accountName: appData.appDynamics.accountName,
    accountAccessKey: appData.appDynamics.accountAccessKey,
    applicationName: appData.appDynamics.applicationName,
    tierName: appData.appDynamics.tierName,
    nodeName: 'process'
  });
}
else {
  console.log('warning: Missing App Dynamics configuration data (app performance monitoring disabled)');
}

var app = require('./lib/app');

var port = process.env.PORT || 3000;

var server = app(appData).listen(port, function() {
});

