#!/usr/bin/env node

var sys = require('sys');

var YUI = require("./lib/node-yui3").YUI;

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
    logExclude: {
        //'attribute': true,
        //'base': true,
        //'get': true,
        //'loader': true,
        //'yui': true,
        //'widget': true,
        //'event': true
    },
    debug: true
}).use('event', 'node-base', 'tabview', function(Y) {

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    div.innerHTML = '<ul><li><a href="#foo">foo</a></li><li><a href="#bar">bar</a></li><li><a href="#baz">baz</a></li></ul><div><div id="foo">foo content</div><div id="bar">bar content</div><div id="baz">baz content</div></div>';
    document.body.appendChild(div);
    

    Y.log('Creating the TabView from source..');
    Y.log(Y.one('#demo'));

    var tabview = new Y.TabView({
        srcNode: '#demo'
    });

    Y.log('Rendering..');
    tabview.on('render', function() {
        Y.log('Render event listener');
    });
    tabview.render();
    
    Y.log('Done..');
    Y.log(div.outerHTML, 'HTML');

});
