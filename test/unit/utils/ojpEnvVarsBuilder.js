module.exports = function() {
  return new OjpEnvVarsBuilder();
};

function OjpEnvVarsBuilder() {
  var envVars = {
    'OJP_USER': 'some-user',
    'OJP_PASS': 'some-password'
  };

  return {
    withUser: function(username) {
      envVars.OJP_USER = username;
      return this;
    },
    withoutUser: function() {
      delete envVars.OJP_USER;
      return this;
    },
    withPassword: function(password) {
      envVars.OJP_PASS = password;
      return this;
    },
    withoutPassword: function() {
      delete envVars.OJP_PASS;
      return this;
    },
    build: function() {
      return envVars;
    }
  };
}

