#!/usr/bin/env node

var sys = require('sys');

var YUI = require("../lib/node-yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");

YUI({
    filter: 'debug',
    debug: true
}).use('json', 'nodejs-dom', 'base', 'io-nodejs', function(Y) {

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
                Y.log(sys.inspect(Y.JSON.parse(o.responseText).userinfo));
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
                Y.log(sys.inspect(Y.JSON.parse(o.responseText)));
            }
        }
    });
    

});
