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

    //This deletes all custom NodeJS YUI modules (jsdom, io, etc)
    delete YUI.GlobalConfig.modules;
    //Set this instance to no debugging so it never console logs anything
    YUI.GlobalConfig.debug = false;
    //Replace the default -debug with -min so all the files are -min files.
    YUI.GlobalConfig.loaderPath = YUI.GlobalConfig.loaderPath.replace('-debug', '-min');

    //Add the default yui file, in case we are working with a full combo file.
    var files = [YUI.GlobalConfig.base + 'yui/yui-min.js'];
    
    //Here we will displace 2 default methods and override them.
    var inc = YUI.include;
    var add = YUI.add;

    //Override for YUI.add so that the wrapped fn in modules never get's executed (faster, since we only actually need the module requirements and not the modules code.)
    YUI.add = function(name, fn, version, args) {
        //This keeps everything but Loader from executing it's wrapped function
        if (name.indexOf('loader') === -1) {
            fn = function() {};
        }
        //Call the original add method with the new noop function if needed.
        add.call(YUI, name, fn, version, args);
    };

    //Here is where we grab the filename of the file that is requested.
    YUI.include = function(file, cb) {
        if (grab) {
            files.push(file);
        }
        //Call the original YUI.include.
        inc(file, function(err, data) {
            cb(null, function() {});
        });
    }
    //Setup the YUI instance config
    var yc = {};

    //Add the lang property
    if (config.lang) {
        yc.lang = config.lang;
    }

    //Create the new instance.
    var Y = YUI(yc);
    //Tell the YUI.include file that it can grab files.
    var grab = true;

    //Preloading what's already on the page, telling the YUI.include function
    //  to NOT grab the files until it's done
    if (config.env) {
        grab = false;
        //Using the modules that are already on the page.
        Y.useSync.apply(Y, config.env.split(','));
        grab = true;
    }

    //No config.m given, giving it a default
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
        //This just does the string replaces on the file names
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
    //Now we fire the callback with the files array and the Y.config._cssLoad arrays
    /**
    * Y.config._cssLoad is an internal YUINodeJS holder for CSS files taken from Y.Get.css()
    */
    fn(files, Y.config._cssLoad);
}

module.exports = new YInterface;
