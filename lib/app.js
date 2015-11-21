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
    requestProcessor.processRequest(req.params.origin, req.params.dest, function(results) {
      res.set('Content-Type', 'text/json');
      res.send(results);
    });
  });

  return app;
}

