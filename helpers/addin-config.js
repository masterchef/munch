function getConfig() {
  var config = {};
  return config;
}

function setConfig(config, callback) {
  Office.context.roamingSettings.saveAsync(callback);
}