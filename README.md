# microphone.js
microphone.js is a simple library that allows you to use the new SpeechRecognition library
(currently only available in Chrome) to recognize and act on voice commands in JavaScript.

## Playground
Clone this repository, and spin up a simple web server to serve index.html and the JavaScript.

```
$ git clone https://github.com/stderr/microphone.js.git
$ cd microphone.js/
$ python -m SimpleHTTPServer
```

## Usage
The primary usage of microphone.js is through the `addCommand` function. This takes two main arguments:
`patterns`, which is assumed to be an array of regular expressions, and the `callback`, which is
the code that will be run if any of the patterns specified match the voice input.

```javascript
Microphone.addCommand({
  patterns: [new RegExp('dog', 'i')],
  callback: function(mic, command) {
    alert("no, cats!");
  }
});
```
