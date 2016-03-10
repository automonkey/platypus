module.exports = function() {
  return new appDynamicsConfigBuilder();
}

function appDynamicsConfigBuilder() {
  var cfg = {
    'APP_DYNAMICS_CONTROLLER_HOST_NAME': 'controller-host-name',
    'APP_DYNAMICS_ACCOUNT_NAME': 'account-name',
    'APP_DYNAMICS_ACCOUNT_ACCESS_KEY': 'account-key',
    'APP_DYNAMICS_APP_NAME': 'app-name',
    'APP_DYNAMICS_TIER_NAME': 'tier-name'
  };

  return {
    withControllerHostName: function(hostname) {
      updateValue('APP_DYNAMICS_CONTROLLER_HOST_NAME', hostname);
      return this;
    },
    withAccountName: function(accountname) {
      updateValue('APP_DYNAMICS_ACCOUNT_NAME', accountname);
      return this;
    },
    withAccountAccessKey: function(key) {
      updateValue('APP_DYNAMICS_ACCOUNT_ACCESS_KEY', key);
      return this;
    },
    withApplicationName: function(appName) {
      updateValue('APP_DYNAMICS_APP_NAME', appName);
      return this;
    },
    withTierName: function(tier) {
      updateValue('APP_DYNAMICS_TIER_NAME', tier);
      return this;
    },
    withoutVar: function(envVar) {
      delete cfg[envVar];
      return this;
    },
    build: function() {
      return cfg;
    }
  };

  function updateValue(key, val) {
    if(cfg.hasOwnProperty(key)) {
      cfg[key] = val;
    }
  };
}
