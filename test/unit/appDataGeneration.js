var expect = require('chai').expect;
var mockery = require('mockery');
var ojpEnvVars = require('./utils/ojpEnvVarsBuilder');

describe('App data generation', function() {

  var envStub = function() {
    var envVars = [];
    return {
      setVars: function(vars) {
        envVars = vars;
      },
      clearVars: function() {
        envVars = [];
      },
      stub: {
        readEnvVar: function(variable) {
          return envVars[variable];
        }
      }
    };
  }();

  var dataFromEnv = null;

  before(function() {
    mockery.enable();
    mockery.registerMock('./env', envStub.stub);
    mockery.registerAllowable('../../lib/appData');
    dataFromEnv = require('../../lib/appData').generateAppDataFromEnvironment;
  });

  after(function() {
    mockery.disable();
  });

  beforeEach(function() {
    envStub.clearVars();
  });

  describe('OJP credentials', function() {

    it('Should read credentials', function() {
      envStub.setVars(
        ojpEnvVars()
          .withUser('some-username')
          .withPassword('some-password')
          .build());

      var appData = dataFromEnv()
      appData.should.have.property('ojpCreds');

      var ojpCreds = appData.ojpCreds;
      ojpCreds.should.have.property('user', 'some-username');
      ojpCreds.should.have.property('password', 'some-password');
    });

    it('Should error if missing username', function() {
      envStub.setVars(
        ojpEnvVars()
          .withoutUser()
          .build());

      expect(dataFromEnv).to.throw(Error);
    });

    it('Should error if missing password', function() {
      envStub.setVars(
        ojpEnvVars()
          .withoutPassword()
          .build());

      expect(dataFromEnv).to.throw(Error);
    });

  });

});

