var assert = require('assert');
var chai = require('chai');
var request = require('supertest');
var appData = require('../../lib/appData').generateAppDataFromEnvironment();
var app = require('../../lib/app');

chai.should();
chai.use(require('chai-array'));
chai.use(require('chai-things'));

describe('Server', function() {

  it('should report results on single destination endpoint',
    testGetResultsFrom('/ECR/TBD'));

  it('should report results on multi destination endpoint',
    testGetResultsFrom('/ECR?destinations=TBD,HHE'));

  it('should reject requests with more than 3 destinations',
    requestGeneratesBadRequestError('/ECR?destinations=ONE,TWO,THR,FOU'));

});

function testGetResultsFrom(path) {
  return function(done) {

    request(app(appData))
      .get(path)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) throw done(err);

        var results = res.body;

        results.should.not.be.empty;
        results.should.all.have.property('destinationStation');
        results.should.all.have.property('scheduledDeparture');

        done();
      });
  };
};

function requestGeneratesBadRequestError(path) {
  return function(done) {

    request(app(appData))
      .get(path)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) throw done(err);

        done();
      });
  };
};
