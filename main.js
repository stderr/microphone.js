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

  Microphone.add_command({
    patterns: [new RegExp("display", "i")],
    callback: function(mic, command) {
      $("#" + command.args[0]).fadeIn();
      mic.done();
    }
  });

  Microphone.add_command({
    patterns: [new RegExp("hide", "i")],
    callback: function(mic, command) {
      $("#" + command.args[0]).fadeOut();
      mic.done();
    }
  });

  $('#btn-start').click(function() {
    Microphone.turn("on");
  });

  $('#btn-stop').click(function() {
    Microphone.turn("off");
  });
});

