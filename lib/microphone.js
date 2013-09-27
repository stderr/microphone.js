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
        actions: []
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
        console.log("on");
        this.recognition.onresult = this.parse(this);
        this.recognition.start();
        return this;
      }

      Microphone._off = function() {
        this.recognition.stop();
        return this;
      }

      Microphone.parse = function(scope) {
        var microphone = scope;
        return function(event) {
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if(event.results[i].isFinal) {
              microphone.currentTranscript += event.results[i][0].transcript;
              for(var command in microphone.actions) {
                var matchedAction = microphone.actions[command].canHandle(microphone.currentTranscript);
                  if(matchedAction) {
                    return microphone.actions[command].callback(microphone, commands.CommandString(matchedAction, microphone.currentTranscript));
                  }
              }
            }
          }
        }

      }

      Microphone.add_command = function(command) {
        this.actions.push(commands.createCommand(command));
      }

      return Microphone;
    }
  }
});


