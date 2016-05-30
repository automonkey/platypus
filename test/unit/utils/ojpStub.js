var Promise = require('bluebird');

module.exports.createStubOjp = function() {
  return {
    stubOjpResults: {},

    addResult: function(destination, ojpResult) {
      if (this.stubOjpResults.hasOwnProperty(destination) === false) {
        this.stubOjpResults[destination] = [];
      }
      this.stubOjpResults[destination].push(ojpResult);
    },

    resetStubResults: function() {
      for (var member in this.stubOjpResults) {
        delete this.stubOjpResults[member];
      }
    },

    initOjpInterface: function() {
      var stubRes = this.stubOjpResults;
      return {
        fetchJourneyData: function(route) {
          return new Promise(function(resolve, reject) {
            resolve(stubRes[route.destination] || []);
          });
        }
      };
    }
  };
};

