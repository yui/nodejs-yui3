#!/usr/bin/env node

var sys = require('sys');

var YUI = require("../lib/node-yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");


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

