#!/usr/bin/env node

var fs = require('fs');
var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    debug: true
}).use('parallel', function(Y) {
    
    Y.log('Reading this directory and reading the contents of each file..');
    var stack = new Y.Parallel();
    fs.readdir(__dirname, stack.add(function(err, files) {
        files.forEach(function(f) {
            fs.readFile(__dirname + f, stack.add(function(err, data) {
                //Do something here..
            }));
        });
    }));
    stack.done(function() {
        Y.log('All callbacks have fired..');
    });

});
