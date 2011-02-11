#!/usr/bin/env node
//Catch example errors
var timer = setTimeout(function() {
    console.log('Failed to read stdin in 5 seconds, exiting..');
    process.exit(1)
}, 5000);

// curl -s http://yuilibrary.com/ | ./stdin.js

require('yui3').stdin(function(Y) {
    clearTimeout(timer);
    Y.log('Page Title: ' + Y.one('title').get('innerHTML'));
    Y.log('Anchors: ' + Y.all('a').size());
    Y.log('Lists: ' + Y.all('ol,ul').size());
    Y.log('List Items: ' + Y.all('li').size());
});

