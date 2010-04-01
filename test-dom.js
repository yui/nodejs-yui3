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
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('event', 'node-base', 'tabview', function(Y) {

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));


    var simple = true;
    //var simple = false;
    
    if (simple) {
        var i = Y.Node.create('<i>Test This</i>');
        i.addClass('foo');

        var div = document.createElement('div');
        div.id = 'foo';
        div.innerHTML = '<em>Test</em> this <strong>awesome <u>shit..</u></strong>';
        document.body.appendChild(div);

        var foo = Y.one('#foo');
        foo.addClass('bar');

        Y.log(document.getElementById('foo').outerHTML, 'GEBI');

        //sys.puts('Inside2: ' + sys.inspect(process.memoryUsage()));
        //Y.log(Y.all('#foo strong, #foo em'));
        Y.log(Y.all('#foo strong'));
        //sys.puts('Inside3: ' + sys.inspect(process.memoryUsage()));

        Y.log(i.toString(), 'node-instance');
        Y.log(Y.Node.getDOMNode(i).outerHTML, 'HTML');
        Y.log(foo.toString(), 'node-instance');
        Y.log(foo.get('className'), 'classname');
        Y.log(Y.Node.getDOMNode(foo).outerHTML, 'HTML');
    
    } else {
        //sys.puts('Inside4: ' + sys.inspect(process.memoryUsage()));

        var div = document.createElement('div');
        div.id = 'demo';
        div.innerHTML = '<ul><li><a href="#foo">foo</a></li><li><a href="#bar">bar</a></li><li><a href="#baz">baz</a></li></ul><div><div id="foo">foo content</div><div id="bar">bar content</div><div id="baz">baz content</div></div>';
        document.body.appendChild(div);

        Y.log('Creating the TabView..');
        var tabview = new Y.TabView({
            srcNode: '#demo'
        });

        tabview.render();
        
        /*
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
        */

        //sys.puts('Inside5: ' + sys.inspect(process.memoryUsage()));
        //sys.puts(sys.inspect(document, false, null));
        //sys.puts(sys.inspect(tabview, false, null));
        //tabview.render('#demo');
        Y.log('Rendering..');
        //tabview.render(div);
        Y.log('Done..');
        Y.log(div.outerHTML, 'HTML');
    }

});
