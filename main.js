requirejs.config({
  baseUrl: './lib',
  paths: {
    jquery: "../vendor/jquery-2.0.3.min"
  },
  shim: {
    jquery: ["require"]
  }
});

require(['jquery','microphone'], function($, microphone) {
  var Microphone = microphone.create();

  Microphone.addCommand({
    patterns: [new RegExp("display", "i")],
    callback: function(mic, command) {
      $("#" + command.args[0]).fadeIn();
    }
  });

  Microphone.addCommand({
    patterns: [new RegExp("hide", "i")],
    callback: function(mic, command) {
      $("#" + command.args[0]).fadeOut();
    }
  });

  $('#btn-start').click(function() {
    Microphone.on();
  });

  $('#btn-stop').click(function() {
    Microphone.off();
  });

});

