#!/usr/bin/env node
var sys = require('sys');

var YUI = require("yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");

YUI({
    filter: 'debug',
    logExclude: {
        'attribute': true,
        'base': true,
        //'get': true,
        //'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', 'event', 'node-base', 'tabview', function(Y) {

    var document = Y.Browser.document;
    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    document.body.appendChild(div);
    
    Y.log('Creating the TabView from script..');
    var tabview = new Y.TabView({
        children: [{
            label: 'foo',
            content: '<p>foo content</p>'
        }, {
            label: 'bar',
            content: '<p>bar content</p>'
        }, {
            label: 'baz',
            content: '<p>baz content</p>'
        }]
    });

    Y.log('Rendering..');
    tabview.render('#demo');
    //tabview.render(div);
    //tabview.render(Y.Node.getDOMNode(Y.one('#demo')));
    //Y.log(Y.Node.getDOMNode(Y.one('#demo')));
    //Y.log(div);
    Y.log('Done..');
    //Y.log(div.outerHTML, 'HTML');
    Y.log(Y.config.doc.outerHTML);
});
