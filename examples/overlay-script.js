#!/usr/bin/env node
var sys = require('sys');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    logExclude: {
        'attribute': true,
        'base': true,
        //'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', 'event', 'node-base', 'overlay', function(Y) {
    var document = Y.Browser.document;

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    document.body.appendChild(div);
    
    Y.log('Creating the Overlay from script..');
    // Default everything
    var overlay = new Y.Overlay({
        headerContent:"My Overlay Header",
        bodyContent:"My Overlay Body",
        footerContent:"My Footer Content",
        x: 200,
        y: 200
    });
    Y.log('Rendering..');
    overlay.render("#demo");
    

    Y.log('Done..');
    Y.log(div.outerHTML, 'HTML');

});
