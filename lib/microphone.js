define(['microphone/commands', 'microphone/utils'], function(commands, utils) {
  return {
    create: function(opts) {
      opts = opts || {};

      var Microphone = {
        possibleStates: ["off", "on", "processing", "paused"],
        state: "off",
        currentTranscript: "",
        recognition: new webkitSpeechRecognition(),
        commandList: opts.commandList || [],
        beforeEach: opts.beforeEach,
        afterEach: opts.afterEach
      };

      Microphone.recognition.continuous = true;
      Microphone.recognition.interimResults = true;

      Microphone.possibleStates.forEach(function(state) {
        Microphone["is" + utils.capitalize(state)] = function() {
          return this.state == state;
        }
      });

      Microphone.parseSpeech = function(scope) {
        var microphone = scope;
        return function(event) {
          for (var i=event.resultIndex; i < event.results.length; ++i) {
            microphone._processResult(event.results[i]);
          }
        }
      }

      Microphone.getMatch = function(command) {
        return command.patternFor(this.currentTranscript);
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
        if(!this.isProcessing()) return;
        this.state = "on";
        this.currentTranscript = "";
      }

      Microphone.on = function() {
        if(!this.isOff()) return;
        this.recognition.onresult = this.parseSpeech(this);
        this.recognition.start();
        this.state = "on";
        return this;
      }

      Microphone.off = function() {
        if(this.isOff()) return;
        this.recognition.stop();
        this.state = "off";
        return this;
      }

      Microphone._wrapCall = function(command, fn) {
        if(this.beforeEach) this.beforeEach(command);
        fn();
        if(this.afterEach) this.afterEach(command);
      }

      Microphone._processResult = function(result) {
        if(!result.isFinal) return;
        var mic = this;
        this.currentTranscript += result[0].transcript;

        this.commandList.forEach(function(command) {
          var matchedPattern = mic.getMatch(command);
          if(matchedPattern) {
            mic._wrapCall(command, function() {
              mic.callCommand(command, matchedPattern);
            });
            return mic.done();
          }
        });
      }

      return Microphone;
    }
  }
});


