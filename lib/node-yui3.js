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
var inter = {};

inter.__defineGetter__('YUI', function() {
    var YUI = getYUI();
    return YUI;
});

inter.silent = function(c) {
    var YUI = getYUI(c);
    return YUI({ debug: false });
};
inter.sync = function(c) {
    var YUI = getYUI(c);
    YUI.loadSync = true;
    return YUI();
};
inter.async = function(c) {
    var YUI = getYUI(c);
    YUI.loadSync = false;
    return YUI();
};

inter.useSync = function() {
    var YUI = getYUI();
    YUI.loadSync = true;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

inter.use = function() {
    var YUI = getYUI();
    YUI.loadSync = false;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

inter.configure = function (config) {
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
inter.rls = function(config, fn) {
    //The config to create the YUI instance with
    var c = {
        core: config.v,
        gallery: config.gv,
        yui2: config['2v'] || config['2in3v']
    };
    
    var YUI = getYUI(c);
    require('./yui3-rls').rls(YUI, config, fn);

}

/**
* Inject the given HTML into a new YUI instance and return the instance.
* @method fromString
* @param {HTML} html The HTML string to inject into the YUI instance
* @param {Object} config Optional YUI Config object
* @param {Function} fn The callback executed when the process is completed
* @returns {Callback} Y, html Callback returns two arguments. Y is the Y instance created, html is the original HTML.
*/
inter.fromString = function(html, config, fn) {
    if (typeof config === 'function') {
        fn = config;
        config = {};
    }
    makeYUIFromHTML(html, config, fn);
};

/**
* Inspired by: https://github.com/visionmedia/query/
*/
/**
* This method listens for the process stdin and takes the html from it and injects it into a new YUI instance.
* @method stdin
* @param {Object} config Optional YUI Config object
* @param {Function} fn The callback executed when the process is completed
* @returns {Callback} Y, html Callback returns two arguments. Y is the Y instance created, html is the original HTML.
*/
inter.stdin = function(config, fn) {
    if (typeof config === 'function') {
        fn = config;
        config = {};
    }
    var YUI = getYUI(config);

    var stdin = process.openStdin(),
        html = '';

    stdin.setEncoding('utf8');
    stdin.on('data', function(data) {
        html += data;
    });
    stdin.on('end', function() {
        makeYUIFromHTML(html, config, fn);
    });

};

//Helper method to make a YUI instance from a string, used in fromString and stdin
var makeYUIFromHTML = function(html, config, fn) {
    var YUI = getYUI(config);

    YUI({ logInclude: { cli: true } ,  debug: true }).use('node', function(Y) {
        if (html.indexOf('<body') === -1) {
            //No Body, append to body
            Y.one('body').append(html);
        } else if (html.indexOf('<html') > -1) {
            //This is an HTML doc
            Y.one('doc').set('innerHTML', html);
        } else if (html.indexOf('<body') === 0) {
            //Body without HTML
            Y.one('body').replace(html);
        }
        fn(Y, html);
    });
};

module.exports = inter;
