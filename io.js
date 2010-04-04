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
    debug: true
}).use('json', 'base', 'io-nodejs', function(Y) {

    var url = 'http:/'+'/yuilibrary.com/gallery/api/user/davglass';
    
    var url2 = 'http:/'+'/localhost/~davglass/node-post/';
    
    Y.io(url, {
        xdr: {
            use: 'nodejs'
        },
        on: {
            start: function() {
                Y.log('Start IO', 'info', 'TEST');
            },
            success: function(id, o) {
                //Y.log(o.responseText);
                Y.log(Y.JSON.parse(o.responseText).userinfo);
            }
        }
    });


    Y.io(url2, {
        xdr: {
            use: 'nodejs'
        },
        method: 'POST',
        headers: {
            foo: 'bar'
        },
        data: 'test=post&this=data&testing=three',
        on: {
            start: function() {
                Y.log('Start IO', 'info', 'TEST');
            },
            success: function(id, o) {
                //Y.log(o.responseText);
                Y.log(Y.JSON.parse(o.responseText));
            }
        }
    });
    

});
