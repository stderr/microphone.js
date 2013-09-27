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

      for(var stateIndex in Microphone.possibleStates) {
        Microphone["is" + capitalizeString(Microphone.possibleStates[stateIndex])] = function() {
          return Microphone.state === Microphone.possibleStates[stateIndex];
        }
      }

      Microphone.done = function() {

        if(this.isProcessing) {
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

      Microphone.getMatch = function(command) {
        return this.commandList[command].canHandle(this.currentTranscript);
      }

      Microphone.callCommand = function(command, match) {
        this.commandList[command].callback(this, commands.CommandString(match, this.currentTranscript))
      }

      Microphone.parseSpeech = function(scope) {
        var microphone = scope;
        return function(event) {
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if(!event.results[i].isFinal) return;
            microphone.currentTranscript += event.results[i][0].transcript;
            for(var command in microphone.commandList) {
              var matchedCommand = microphone.getMatch(command);
              if(matchedCommand) return microphone.callCommand(command, matchedCommand);
            }
          }
        }
      }

      Microphone.add_command = function(command) {
        this.commandList.push(commands.createCommand(command));
      }

      return Microphone;
    }
  }
});


