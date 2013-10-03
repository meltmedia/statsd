/*jshint node:true, laxcomma:true */

var fs  = require('fs')
  , util = require('util');

var Configurator = function (file) {

  var self = this;
  var config = {};
  var oldConfig = {};

  this.updateConfig = function () {
    fs.exists(file, function(exists) {
      if (exists) {
        util.log('reading config file: ' + file);

        fs.readFile(file, function (err, data) {
          if (err) { throw err; }
          old_config = self.config;

          self.config = eval('config = ' + fs.readFileSync(file));
          self.emit('configChanged', self.config);
        });
      } else {
        util.log('loading config from argument: ' + file)
        old_config = self.config;

        self.config = eval('config = ' + file);
        self.emit('configChanged', self.config);
      }
    });
  };

  this.updateConfig();

  fs.exists(file, function(exists) {
    if (exists) {
      fs.watch(file, function (event, filename) {
          if (event == 'change') { self.updateConfig(); }
      });
    }
  });
};

util.inherits(Configurator, process.EventEmitter);

exports.Configurator = Configurator;

exports.configFile = function(file, callbackFunc) {
  var config = new Configurator(file);
  config.on('configChanged', function() {
    callbackFunc(config.config, config.oldConfig);
  });
};

