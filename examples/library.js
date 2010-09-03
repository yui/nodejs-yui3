#!/usr/bin/env node

var sys = require('sys');

var YUI = require("yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");


YUI({
    filter: 'debug',
    debug: true
}).use('json', 'base', 'yql', function(Y) {

    //sys.puts('Inside: ' + sys.inspect(process.memoryUsage()));
    //Logger outputs with sys.puts
    Y.log('This is a test');
    //Lang is available
    Y.log('Test: ' + Y.Lang.isBoolean(true), 'debug', 'myapp');

    //Creating a simple class
    var One = function() {
        One.superclass.constructor.apply(this, arguments);
    };
    //Extending it with Y.Base so we have Custom Events and a lifecycle
    Y.extend(One, Y.Base, {
        test: function() {
            this.publish('foo', {
                emitFacade: true
            });
            this.fire('foo');
        }
    }, {
        NAME: 'one'
    });

    //Create a new instance of our new class
    var o = new One();
    o.on('foo', function(o) {
        Y.log('Foo Fired', 'debug', 'myapp');
        //Y.log(o, 'debug');
    });
    o.test(); //Should fire the one:foo Event.

    //sys.puts(sys.inspect(Y));
    
    Y.YQL('select * from github.user.info where (id = "davglass")', function(r) {
        //Do something here.
        Y.log(r.query, 'debug', 'yql');
    });

    var json = '{ "test": "one" }';
    Y.log(Y.JSON.parse(json), 'debug', 'json');

});
