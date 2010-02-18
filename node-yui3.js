var sys = require('sys');

YUI.config.loaderPath = 'loader/loader-debug.js';
YUI.config.base = './yui3/build/';


YUI.add('yui-log', function(Y) {
    Y.log = function(str, t, m) {
        //Needs to support what Y.log does with the excludeLog and includeLog
        if (Y.config.debug) {
            t = t || 'info';
            m = (m) ? '(' +  m+ ') ' : '';
            var o = false;
            if (Y.Lang.isObject(str) || Y.Lang.isArray(str)) {
                //Should we use this?
                str = sys.inspect(str);
            }
            sys.puts('[' + t.toUpperCase() + ']: ' + m + str);
        }
    };
});


YUI.add('get', function(Y) {
    Y.Get = function() {};
    Y.Get.script = function(s, cb) {
        url = s.replace('.js', '');
        Y.log('URL: ' + url, 'info', 'get');
        process.mixin(GLOBAL, require(url));
        if (Y.Lang.isFunction(cb.onEnd)) {
            cb.onEnd.call(Y, cb.data);
        }
        if (Y.Lang.isFunction(cb.onSuccess)) {
            cb.onSuccess.call(Y, cb);
        }
        if (Y.Lang.isFunction(cb.onComplete)) {
            cb.onComplete.call(Y);
        }
    };
});

