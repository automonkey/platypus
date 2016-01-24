var app = require('./lib/app');
var appData = require('./lib/appData').generateAppDataFromEnvironment();

var port = process.env.PORT || 3000;

var server = app(appData).listen(port, function() {
});

