var express = require('express');
var request = require('request');

var ojpRequestTracking = require('./ojpRequestTracking');
var requestProcessing = require('./requestProcessing');

module.exports = function(appData) {
  var app = express();
  var router = express.Router();
  var ojpRequestTracker = ojpRequestTracking.initOjpRequestTracker(appData);
  var requestProcessor = requestProcessing.initRequestProcessor(appData, ojpRequestTracker);

  app.use(router);

  router.get('/:origin/:dest', function(req, res) {
    processRequest(req.params.origin, [req.params.dest], res);
  });

  router.get('/:origin', function(req, res) {
    var destinations = req.query.destinations.split(',');
    processRequest(req.params.origin, destinations, res);
  });

  function processRequest(origin, destinations, res) {
    requestProcessor.processRequest(origin, destinations, function(results) {
      res.set('Content-Type', 'text/json');
      res.send(results);
    });
  }

  return app;
}

