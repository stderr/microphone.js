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

  // Examples:
  Microphone.addCommand({
    patterns: [new RegExp("dog", "i")],
    callback: function() {
      alert("no, cats!");
    }
  });

  // Control the DOM with your voice!
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

  // Respond in kind!
  Microphone.addCommand({
    patterns: [new RegExp("hello", "i")],
    callback: function(mic, command) {
      var speaker = new Audio();
      var message = "Hi, ";
      $nameInput = $("#my-name");

      if($nameInput.val()) {
        message += $nameInput.val();
      } else {
        message += "stranger";
      }

      speaker.src = "http://tts-api.com/tts.mp3?q=" + escape(message);
      speaker.play();
    }
  });

  $('#btn-start').click(function() {
    Microphone.on();
  });

  $('#btn-stop').click(function() {
    Microphone.off();
  });

});

