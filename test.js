var sys = require('sys');

var YUI = require("./node-yui3").YUI;

// TODO: This should pass, but currently doesn't.
// yui-core.js creates a global YUI unnecessarily.
// Rather than testing exports and assigning the global to the exports object,
// it should sniff for exports, and if not found, set it to the global object,
// and then do exports.YUI = YUI; in either case, thus putting YUI where it
// belongs for the environment in question.
// Replying on global leakage is ill-advised if not absolutely necessary.

// require("assert").equal( global.YUI, undefined, "global yui created");

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

