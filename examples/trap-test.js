#!/usr/bin/env node

var sys = require('sys');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    debug: true,
    modules: {
        'error': {
            fullpath: __dirname + '/trap-error.js'
        }
    }
}).use('json', 'error', function(Y) {

    Y.log('Loaded..');

});

