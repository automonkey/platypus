var expect = require('chai').expect;
var extend = require('util')._extend;
var mockery = require('mockery');
var appDynamicsEnvVars = require('./utils/appDynamicsEnvVarsBuilder');
var envVars = require('./utils/envVarsBuilder');

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
        envVars()
          .withOjpUser('some-username')
          .withOjpPassword('some-password')
          .build());

      var appData = dataFromEnv()
      appData.should.have.property('ojpCreds');

      var ojpCreds = appData.ojpCreds;
      ojpCreds.should.have.property('user', 'some-username');
      ojpCreds.should.have.property('password', 'some-password');
    });

    it('Should error if missing username', function() {
      envStub.setVars(
        envVars()
          .withoutOjpUser()
          .build());

      expect(dataFromEnv).to.throw(Error);
    });

    it('Should error if missing password', function() {
      envStub.setVars(
        envVars()
          .withoutOjpPassword()
          .build());

      expect(dataFromEnv).to.throw(Error);
    });

  });

  describe('App Dynamics configuration', function() {

    it('Should read config', function() {
      envStub.setVars(
        envVarsWithVars(
          appDynamicsEnvVars()
            .withControllerHostName('some-host-name')
            .withAccountName('some-account-name')
            .withAccountAccessKey('some-key')
            .withApplicationName('some-app')
            .withTierName('some-tier')
            .build()));

      var appData = dataFromEnv();
      appData.should.have.property('appDynamics');

      var appDynamicsData = appData.appDynamics;
      appDynamicsData.should.have.property('controllerHostName', 'some-host-name');
      appDynamicsData.should.have.property('accountName', 'some-account-name');
      appDynamicsData.should.have.property('accountAccessKey', 'some-key');
      appDynamicsData.should.have.property('applicationName', 'some-app');
      appDynamicsData.should.have.property('tierName', 'some-tier');
    });

    describe('Should report no app dynamics config if any App Dynamics env vars missing', function() {

      var completeAppDynamicsConfig = appDynamicsEnvVars().build();
      for (var envVar in completeAppDynamicsConfig) {
        if(completeAppDynamicsConfig.hasOwnProperty(envVar)) {
          (function(excludedEnvVar) {
            it('When missing \'' + excludedEnvVar + '\'', function() {
              envStub.setVars(
                envVarsWithVars(
                  appDynamicsEnvVars()
                    .withoutVar(excludedEnvVar)
                    .build()));
              var appData = dataFromEnv();
              appData.should.not.have.property('appDynamics');
            });
          })(envVar);
        }
      }

    });

    function envVarsWithVars(vars) {
      return envVars().withVars(vars).build();
    }

  });

});

