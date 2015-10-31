var express = require('express');
var request = require('request');

var ojp = require('./ojp');

var createApp = function(appData) {
  var app = express();
  var router = express.Router();

  app.use(router);

  router.get('/:origin/:dest', function(req, res) {
    var route = {
      origin: req.params.origin,
      destination: req.params.dest
    };

    ojp.fetchJourneyData(appData.ojpCreds, route, function(response) {
      res.set('Content-Type', 'text/xml');
      res.send(response);
    });
  });

  return app;
}

module.exports = createApp;

