#!/usr/bin/env node
var sys = require('sys');

var YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    debug: true
}).use('overlay', function(Y) {
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
