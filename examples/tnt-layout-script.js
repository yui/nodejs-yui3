#!/usr/bin/env node
var sys = require('sys'),
    fs = require('fs');

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
}).use('nodejs-dom', function(Y) {
    //GLOBALS!!!!
    document = Y.Browser.document;
    navigator = Y.Browser.navigator;
    window = Y.Browser.window;
    location = Y.Browser.location;
    self = Y.Browser.self;


    Y.log('JSDom testing..');

    Y.use('yui2-layout', function(Y) {
        var YAHOO = Y.YUI2;
        fs.readFile('./markup/layout.html', encoding='utf-8', function(err, data) {
            Y.log('Markup loaded..');
            Y.log(data);
            document.body.innerHTML = data;
            var layout = new YAHOO.widget.Layout({
                units: [
                    { position: 'top', height: 50, body: 'top1', header: 'Top', gutter: '5px', collapse: true, resize: true },
                    { position: 'right', header: 'Right', width: 300, resize: true, gutter: '5px', footer: 'Footer', collapse: true, scroll: true, body: 'right1', animate: true },
                    { position: 'bottom', header: 'Bottom', height: 100, resize: true, body: 'bottom1', gutter: '5px', collapse: true },
                    { position: 'left', header: 'Left', width: 200, resize: true, body: 'left1', gutter: '5px', collapse: true, close: true, collapseSize: 50, scroll: true, animate: true },
                    { position: 'center', body: 'center1' }
                ]
            });
            Y.log('Rendering..');
            layout.render();


            Y.log('Done..');
            Y.log(document.body.outerHTML, 'HTML');
        });
    });

});
