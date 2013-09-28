# microphone.js
microphone.js is a simple library that allows you to use the new [Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) 
(currently only available in Chrome) to recognize and act on voice commands in JavaScript.

## Playground
Clone this repository, and spin up a simple web server to serve index.html and the JavaScript.

```
$ git clone https://github.com/stderr/microphone.js.git
$ cd microphone.js/
$ python -m SimpleHTTPServer
```

## Usage
To instantiate the main `Microphone` object, use the `create` function:
```javascript
require(['microphone'], function(microphone){
  var Microphone = microphone.create();
});
```

To activate voice processing, use the `on` function:
```javascript
Microphone.on();
```

The primary usage of microphone.js is through the `addCommand` function. This takes two main arguments:
`patterns`, which is assumed to be an array of regular expressions, and the `callback`, which is
the code that will be run if any of the patterns specified match the voice input:

```javascript
Microphone.addCommand({
  patterns: [new RegExp('dog', 'i')],
  callback: function() {
    alert("no, cats!");
  }
});
```

The `callback` also receives two arguments: the current `Microphone` instance, allowing the user to
inspect the `currentTranscript` and other relevant information; and the matched `CommandString`, which
exposes the `matched` string, and the `args`, which is an array of the words following the `matched` string.
This allows you to do things like:

```javascript
Microphone.addCommand({
  patterns: [new RegExp("display", "i")],
  callback: function(mic, command) {
    $("#" + command.args[0]).show();
  }
});
```

Thus, if you said "display foo", the DOM element with an id of `foo` would be shown (presuming you are
using jQuery, of course).
