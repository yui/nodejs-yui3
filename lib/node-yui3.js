var getYUI = function(c) {
    var yui3 = require('./yui3-yui3');
    var YUI = yui3.configure(c);
    if (c) {
        cleanCache();
    }
    return YUI;
}

var cleanCache = function() {
    for (var i in require.main.moduleCache) {
        var id = require.main.moduleCache[i].id+'';
        if (id && id.match(/yui3/)) {
            delete require.main.moduleCache[i];
        }
    }
}

// YInterface allows these two to work:
// var Y = yui3.useSync("io");
// var Y = yui3.configure({core:"3.3.0"}).useSync("io");
// See also: tests/interface.js

function YInterface (config) {
    this.config = config || {};
}

var interface = YInterface.prototype;

interface.__defineGetter__('YUI', function() {
    var YUI = getYUI(this.config);
    return YUI;
});


interface.sync = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = true;
    return YUI();
};
interface.async = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = false;
    return YUI();
};

interface.useSync = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = true;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.use = function() {
    var YUI = getYUI(this.config);
    YUI.loadSync = false;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

interface.configure = function (config) {
    return new YInterface(config);
};

interface.rls = function(config, fn) {
    var c = {
        core: config.v,
        gallery: config.gv,
        yui2: config['2v'] || config['2in3v']
    };

    var YUI = getYUI(c);

    delete YUI.GlobalConfig.modules;
    YUI.GlobalConfig.debug = false;
    YUI.GlobalConfig.loaderPath = YUI.GlobalConfig.loaderPath.replace('-debug', '-min');

    var files = [YUI.GlobalConfig.base + 'yui/yui-min.js'];

    var inc = YUI.include;
    var add = YUI.add;

    YUI.add = function(name, fn, version, args) {
        //This keeps everything but Loader from executing it's wrapped function
        if (name.indexOf('loader') === -1) {
            fn = function() {};
        }
        add.call(YUI, name, fn, version, args);
    };
    YUI.include = function(file, cb) {
        if (grab) {
            files.push(file);
        }
        inc(file, function(err, data) {
            cb(null, function() {});
        });
    }

    var Y = YUI();
    var grab = true;
    if (config.env) {
        //Preloading what's already on the page, telling the script to NOT grab the files until it's done
        grab = false;
        Y.useSync.apply(Y, config.env.split(','));
        grab = true;
    }
    //No .m given, giving it a default
    if (!config.m) {
        config.m = 'yui,loader'; //Default here?
    }
    
    //Now we use the modules they are asking for..
    var mods = config.m.split(',');
    Y.useSync.apply(Y, mods);

    //If yui is NOT in the config.m list, drop it from the array
    if (mods.indexOf('yui') === -1) {
        files.splice(0, 1);
    }
    //If loader is NOT in the config.m list, drop it from the array
    if (mods.indexOf('loader') === -1) {
        files.splice(0, 1);
    }
    //Filter the URL's
    if (config.filt) {
        var str = '';
        switch (config.filt.toLowerCase()) {
            case 'raw':
                str = '';
                break;
            case 'debug':
                str = '-debug';
                break;
            default:
                str = '-min';
                break;
        }
        files.forEach(function(v, k) {
            files[k] = v.replace('-min', str);
        });
    }
    fn(files);
}

module.exports = new YInterface;
