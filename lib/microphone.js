define(['microphone/commands'], function(commands) {
  function capitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return {
    create: function() {

      var Microphone = {
        possibleStates: ["off", "on", "processing"],
        state: "off",
        currentTranscript: "",
        recognition: new webkitSpeechRecognition(),
        commandList: []
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
              var matchedCommand = microphone.getMatch(command);
              if(matchedCommand) return microphone.callCommand(command, matchedCommand);
            });

          }
        }
      }

      Microphone.getMatch = function(command) {
        return command.canHandle(this.currentTranscript);
      }

      Microphone.callCommand = function(command, match) {
        this.state = "processing";
        command.callback(this, commands.CommandString(match, this.currentTranscript))
      }

      Microphone.addCommand = function(command) {
        this.commandList.push(commands.createCommand(command));
      }

      Microphone.done = function() {

        if(this.isProcessing()) {
          this.state = "on";
          this.currentTranscript = "";
        }
      }

      Microphone.turn = function(how) {
        var how = "_" + how;

        if(!this.hasOwnProperty(how)) { throw Error("'" + how + "' is not a supported action.") }
        var action = this[how];

        action.apply(this, Array.prototype.slice.call(arguments, 1));

        return this;
      }

      Microphone._on = function() {
        this.recognition.onresult = this.parseSpeech(this);
        this.recognition.start();
        return this;
      }

      Microphone._off = function() {
        this.recognition.stop();
        return this;
      }

      return Microphone;
    }
  }
});


