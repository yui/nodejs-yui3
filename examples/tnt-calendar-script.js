#!/usr/bin/env node
var sys = require('sys'),
    fs = require('fs');

var YUI = require("yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");


YUI({
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
            Y.log(document.outerHTML, 'HTML');
        });
        cal1.render();
    });

});
