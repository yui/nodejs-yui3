var getYUI = function(c) {
    var yui3 = require('./yui3-yui3');
    var YUI = yui3.configure(c);
    cleanCache();
    return YUI;
}
/*
* I really, really, really hate this hack. But with the "require" being cached
* a custom YUI config is not possible.
*/
var cleanCache = function() {
    var i, id;
    if (require.main && require.main.moduleCache) { //0.2.x
        for (i in require.main.moduleCache) {
            id = require.main.moduleCache[i].id+'';
            if (id && id.match(/yui3/)) {
                delete require.main.moduleCache[i];
            }
        }
    } else if (require.cache) { //0.3.x
        for (i in require.cache) {
            var id = require.cache[i].id+'';
            if (id && id.match(/yui3/)) {
                delete require.cache[i];
            }
        }
        
    }
}

// YInterface allows these two to work:
// var Y = yui3.useSync("io");
// var Y = yui3.configure({core:"3.3.0"}).useSync("io");
// See also: tests/interface.js
var interface = {};

interface.__defineGetter__('YUI', function() {
    var YUI = getYUI();
    return YUI;
});

interface.silent = function(c) {
    var YUI = getYUI(c);
    return YUI({ debug: false });
};
interface.sync = function(c) {
    var YUI = getYUI(c);
    YUI.loadSync = true;
    return YUI();
};
interface.async = function(c) {
    var YUI = getYUI(c);
    YUI.loadSync = false;
    return YUI();
};

interface.useSync = function() {
    var YUI = getYUI();
    YUI.loadSync = true;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.use = function() {
    var YUI = getYUI();
    YUI.loadSync = false;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.configure = function (config) {
    var YUI = getYUI(config);
    var Y = YUI();
    //Workaround for old school .YUI access..
    Y.__defineGetter__('YUI', function() {
        var YUI = getYUI(config);
        return YUI;
    });
    return Y;
};

/**
* This method accepts the default RLS configuration object and returns two arrays of file paths for js and css files.
* @method rls
* @param {Object} config The RLS configuration to work from
* @param {Function} fn The callback executed when the process is completed
* @returns {Callback} js, css Callback returns two arguments. Both arrays of file paths, one for JS and one for CSS files.
*/
interface.rls = function(config, fn) {
    //The config to create the YUI instance with
    var c = {
        core: config.v,
        gallery: config.gv,
        yui2: config['2v'] || config['2in3v']
    };
    
    var YUI = getYUI(c);
    require('./yui3-rls').rls(YUI, config, fn);

}

module.exports = interface;
