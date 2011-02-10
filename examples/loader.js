#!/usr/bin/env node
var start = (new Date()).getTime();
var YUI = require("yui3").YUI;


YUI({
    combine: false,
    filter: 'debug',
    debug: true
}).use('node', function(Y) {
    
    var end = (new Date()).getTime();
    Y.log(end - start + 'ms', 'info', 'timer');
    
});
