var q = require('q');

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
          var defferedReturn = q.defer();
          defferedReturn.resolve(stubRes[route.destination] || []);
          return defferedReturn.promise;
        }
      };
    }
  };
};

