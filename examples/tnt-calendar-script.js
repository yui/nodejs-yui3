#!/usr/bin/env node
var sys = require('sys'),
    fs = require('fs');

var YUI = require("../lib/node-yui3").YUI;

// TODO: This should pass, but currently doesn't.
// This will work for YUI core, but any submodules are in different files
// This will work better once the 3.1.0 version of YUI is available
// And you can combo handle all the submodules into one request.


//require("assert").equal( global.YUI, undefined, "global yui created");


//Now use non-DOM related YUI utilities
YUI({
    //Only set these if you want to load locally
    loaderPath: 'loader/loader-debug.js',
    base: './yui3/build/',
    filter: 'debug',
    _logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', function(Y) {
    document = Y.Browser.document;
    navigator = Y.Browser.navigator;
    window = Y.Browser.window;
    
    Y.use('yui2-calendar', 'yui2-logger', function() {
        var YAHOO = Y.YUI2;

        Y.log('JSDom testing..');

        var el = document.createElement('div');
        el.id = 'cal1Container';
        document.body.appendChild(el);
        
        var cal1 = new YAHOO.widget.Calendar("cal1Container");
        cal1.renderEvent.subscribe(function() {
            Y.log('Done..');
            Y.log(document.body.outerHTML, 'HTML');
        });
        cal1.render();
    });

});
