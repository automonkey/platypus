var extend = require('util')._extend;

module.exports = function() {
  return new EnvVarsBuilder();
};

function EnvVarsBuilder() {
  var envVars = {
    'OJP_USER': 'some-user',
    'OJP_PASS': 'some-password'
  };

  return {
    withOjpUser: function(username) {
      envVars.OJP_USER = username;
      return this;
    },
    withoutOjpUser: function() {
      delete envVars.OJP_USER;
      return this;
    },
    withOjpPassword: function(password) {
      envVars.OJP_PASS = password;
      return this;
    },
    withoutOjpPassword: function() {
      delete envVars.OJP_PASS;
      return this;
    },
    withVars: function(vars) {
      envVars = extend(envVars, vars);
      return this;
    },
    build: function() {
      return envVars;
    }
  };
}

