define(function() {
  return {
    createCommand: function(opts) {
      return {
        callback: opts.callback || function() {},
        patterns: opts.patterns || [],
        canHandle: function(transcript) {
          for(var pattern in this.patterns) {
           if(this.patterns[pattern].test(transcript)) return this.patterns[pattern];
          }
          return false;
        }
      }
    },
    CommandString: function(matched,transcript) {
      var args = transcript.replace(matched, "").trim().split(" ");

      return {
        matched: matched,
        args: args || []
      }
    }
  }
});
