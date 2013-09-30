define(function() {
  return {
    Command: function(opts) {
      return {
        callback: opts.callback || function() {},
        patterns: opts.patterns || [],

        patternFor: function(transcript) {
          var result = false;

          this.patterns.forEach(function(pattern) {
            if(pattern.test(transcript)) result = pattern;
          });

          return result;
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
