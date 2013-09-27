define(['microphone/commands'], function(commands) {
  function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    create: function(opts) {
      opts = opts || {}

      var Microphone = {
        possibleStates: ["off", "on", "processing"],
        state: "off",
        currentTranscript: "",
        recognition: new webkitSpeechRecognition(),
        commandList: opts.commandList || [],
        beforeEach: opts.beforeEach || null,
        afterEach: opts.afterEach || null
      };

      Microphone.recognition.continuous = true;
      Microphone.recognition.interimResults = true;

      Microphone.possibleStates.forEach(function(state) {
        Microphone["is" + capitalizeString(state)] = function() {
          return this.state == state;
        }
      });

      Microphone.parseSpeech = function(scope) {
        var microphone = scope;
        return function(event) {
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if(!event.results[i].isFinal) return;
            microphone.currentTranscript += event.results[i][0].transcript;

            microphone.commandList.forEach(function(command) {
              var matchedPattern = microphone.getMatch(command);

              if(matchedPattern) {
                microphone._wrap(command, function() {
                  microphone.callCommand(command, matchedPattern);
                });

                return microphone.done();
              }
            });

          }
        }
      }

      Microphone._wrap = function(command, fn) {
        if(this.beforeEach) this.beforeEach(command);
        fn();
        if(this.afterEach) this.afterEach(command);
      }

      Microphone.getMatch = function(command) {
        return command.canHandle(this.currentTranscript);
      }

      Microphone.callCommand = function(command, match) {
        if(this.isProcessing()) return;
        this.state = "processing";
        command.callback(this, commands.CommandString(match, this.currentTranscript))
      }

      Microphone.addCommand = function(command) {
        this.commandList.push(commands.Command(command));
      }

      Microphone.done = function() {

        if(this.isProcessing()) {
          this.state = "on";
          this.currentTranscript = "";
        }
      }

      Microphone.on = function() {

        this.recognition.onresult = this.parseSpeech(this);
        this.recognition.start();
        this.state = "on";
        return this;
      }

      Microphone.off = function() {
        this.recognition.stop();
        this.state = "off";
        return this;
      }

      return Microphone;
    }
  }
});


