var express = require('express');
var request = require('request');

var InputError = require('./inputError');
var ojpRequestTracking = require('./ojpRequestTracking');
var requestProcessing = require('./requestProcessing');

module.exports = function(appData) {
  var app = express();
  var router = express.Router();
  var ojpRequestTracker = ojpRequestTracking.initOjpRequestTracker(appData);
  var requestProcessor = requestProcessing.initRequestProcessor(appData, ojpRequestTracker);

  app.use(router);
  app.use(errorHandler);

  function errorHandler(err, req, res, next) {

    if (err instanceof InputError) {
      res.status(400).json({message: err.message});
      return;
    }

    next(err);
  }

  router.get('/:origin/:dest', function(req, res, next) {
    processRequest(req.params.origin, [req.params.dest], res, next);
  });

  router.get('/:origin', function(req, res, next) {
    var destinations = req.query.destinations;
    if (destinations === undefined) {
      res.status(400).json({error: 'Missing destinations parameter'});
      return;
    }
    processRequest(req.params.origin, destinations.split(','), res, next);
  });

  function processRequest(origin, destinations, res, next) {
    requestProcessor.processRequest(origin, destinations)
    .then(function(results) {
      res.json(results);
    }, function(error) {
      next(error);
    });
  }

  return app;
};

