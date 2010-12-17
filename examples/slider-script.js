#!/usr/bin/env node
var sys = require('sys');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', 'event', 'node-base', 'slider', function(Y) {
    var document = Y.Browser.document;

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    document.body.appendChild(div);
    
    Y.log('Creating the Slider from script..');
    // Default everything
    var slider = new Y.Slider();
    Y.log('Rendering..');
    slider.render("#demo");

    Y.log('Done..');
    Y.log(div.outerHTML, 'HTML');

});
