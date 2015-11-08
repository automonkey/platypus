var express = require('express');
var request = require('request');

var ojp = require('./ojp');
var ojpParser = require('./ojpParser');

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
      ojpParser.parseOjpResponse(response, function(err, results) {
        res.set('Content-Type', 'text/json');
        res.send(results);
      });
    });
  });

  return app;
}

module.exports = createApp;

