#!/usr/bin/env node
var sys = require('sys');

var YUI = require("../lib/node-yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");

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
}).use('nodejs-dom', 'event', 'node-base', 'overlay', function(Y) {
    var document = Y.Browser.document;

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));

    var div = document.createElement('div');
    div.id = 'demo';
    div.innerHTML = '<div id="myContent"><div class="yui-widget-hd">Overlay Header</div><div class="yui-widget-bd">Overlay Body</div><div class="yui-widget-ft">Overlay Footer</div></div>';
    document.body.appendChild(div);
    
    Y.log('Creating the Overlay from source..');
    var overlay = new Y.Overlay({
        // Specify a reference to a node which already exists 
        // on the page and contains header/body/footer content
        srcNode:"#myContent",
 
        // Also set some of the attributes inherited from
        // the base Widget class.
        visible:false,
        width:"20em"
    });
    
    // Default everything
    Y.log('Rendering..');
    overlay.render("#demo");
    

    Y.log('Done..');
    Y.log(div.outerHTML, 'HTML');

});
