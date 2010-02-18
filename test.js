var sys = require('sys');

//sys.puts('Before: ' + sys.inspect(process.memoryUsage()));


//Mixin the YUI file so we have a global YUI object 
process.mixin(GLOBAL, require('./yui3/build/yui/yui-debug'));
//Mixin the bootstrapper that replaces a couple of YUI modules
process.mixin(GLOBAL, require('./node-yui3'));

//sys.puts('After: ' + sys.inspect(process.memoryUsage()));

//Now use non-DOM related YUI utilities
YUI({
    filter: 'debug',
    debug: true
}).use('io-base', 'json', 'base', function(Y) {

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
});

