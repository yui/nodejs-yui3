var sys = require('sys'),
    // it kind of sucks to rely on a global, and would be better not to.
    // but YUI was written to expect this global to already exist.

    //Use this line if you want local lookups
    //YUI = global.YUI = exports.YUI = require('./yui3/build/yui/yui-debug').YUI;
    
    //This line will let you use remote loading
    YUI = global.YUI = exports.YUI = require('./yui-debug').YUI;
    
global.YUI_config = {
    //loaderPath: 'loader/loader-debug.js',
    //base: './yui3/build/',
    useBrowserConsole: true,
    logFn: function(str, t, m) {
        t = t || 'info';
        m = (m) ? '(' +  m+ ') ' : '';
        var o = false;
        if (str instanceof Object || str instanceof Array) {
            //Should we use this?
            str = sys.inspect(str);
        }
        // output log messages to stderr
        sys.error('[' + t.toUpperCase() + ']: ' + m + str);
    }
};

YUI.add('get', function(Y) {

    var end = function(cb, msg, result) {
        //Y.log('Get end: ' + cb.onEnd);
        if (Y.Lang.isFunction(cb.onEnd)) {
            cb.onEnd.call(Y, msg, result);
        }
    }, pass = function(cb) {
        //Y.log('Get pass: ' + cb.onSuccess);
        if (Y.Lang.isFunction(cb.onSuccess)) {
            cb.onSuccess.call(Y, cb);
        }
        end(cb, 'success', 'success');
    }, fail = function(cb, er) {
        //Y.log('Get fail: ' + er);
        if (Y.Lang.isFunction(cb.onFailure)) {
            cb.onFailure.call(Y, er, cb);
        }
        end(cb, er, 'fail');
    };

    Y.Get = function() {};

    Y.Get.script = function(s, cb) {
        var urls = Y.Array(s), url, i, l = urls.length;
        for (i=0; i<l; i++) {
            url = urls[i];
            if (!urls[i].match(/^https?:\/\//)) {
                url = url.replace(/\.js$/, '');
            }
            Y.log('URL: ' + url, 'info', 'get');
            // doesn't need to be blocking, so don't block.
            require.async(url, function (mod) {
                process.mixin(Y, mod);
                pass(cb);
            });
        }
    };
    //Just putting this is so we don't get errors
    Y.Get.css = function(s, cb) {
        Y.log('Loading CSS: ' + s, 'debug', 'get');
        pass(cb);
    };
});
