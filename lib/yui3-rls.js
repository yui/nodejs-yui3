/**
* This method accepts the default RLS configuration object and returns two arrays of file paths for js and css files.
* @method rls
* @param {YUI} YUI The YUI instance to use when creating an RLS server.
* @param {Object} config The RLS configuration to work from
* @param {Function} fn The callback executed when the process is completed
* @returns {Callback} js, css Callback returns two arguments. Both arrays of file paths, one for JS and one for CSS files.
*/
exports.rls = function(YUI, config, fn) {

    //This deletes all custom NodeJS YUI modules (jsdom, io, etc)
    delete YUI.GlobalConfig.modules;
    //Set this instance to no debugging so it never console logs anything
    YUI.GlobalConfig.debug = false;
    //Replace the default -debug with -min so all the files are -min files.
    YUI.GlobalConfig.loaderPath = YUI.GlobalConfig.loaderPath.replace('-debug', '-min');
    
    var parseContent = false;
    if (config.parse) {
        parseContent = config.parse;
    }

    var gMeta, yui2Meta;
    if (config.gmeta) {
        gMeta = require(config.gmeta).Gallery;
        if (gMeta[config.gv]) {
            gMeta = gMeta[config.gv];
        } else {
            gMeta = null;
        }
    }
    if (config.yui2meta) {
        yui2Meta = require(config.yui2meta).YUI2;
        if (yui2Meta[YUI.GlobalConfig.groups.yui2.yui2Version]) {
            yui2Meta = yui2Meta[YUI.GlobalConfig.groups.yui2.yui2Version];
        } else {
            yui2Meta = null;
        }
    }

    //Add the default yui file, in case we are working with a full combo file.
    var files = [YUI.GlobalConfig.base + 'yui/yui-min.js'],
    fileData = {};
    
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
        var pFile = parseContent;
        if (file.indexOf('loader-min') > 0) {
            pFile = true;
        }
        if (grab) {
            files.push(file);
        }
        //Call the original YUI.include.
        if (pFile) {
            inc(file, function(err, data, info) {
                if (err) {
                    console.log(err.stack);
                    return;
                }
                if (grab && parseContent) {
                    fileData[info.file] = info.data;
                }
                cb(null, function() {});
            });
        } else {
            cb(null, function() {});
        }
    }
    //Setup the YUI instance config
    var yc = {};

    //Add the lang property
    if (config.lang) {
        yc.lang = config.lang;
    }
    if (gMeta) {
        yc.modules = gMeta;
    }
    if (yui2Meta) {
        if (!yc.modules) {
            yc.modules = {};
        }
        for (var i in yui2Meta) {
            yc.modules[i] = yui2Meta[i];
        }
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
        if (files[0].indexOf('yui')) {
            files.splice(0, 1);
        }
    }
    //If loader is NOT in the config.m list, drop it from the array
    if (mods.indexOf('loader') === -1) {
        if (files[0].indexOf('loader')) {
            files.splice(0, 1);
        }
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
    var complete = function() {
        //Sanity Check, remove any files from the
        //  fileData object if they are not in the files or css list
        var d = {};
        [].concat(files, Y.config._cssLoad).forEach(function(v) {
            d[v] = fileData[v];
        });
        fn(files, Y.config._cssLoad, d);
    };
    var checkComplete = function() {
        if (missing.length === 0) {
            complete();
        }
    }

    var missing = [];
    var c = 1;
    [].concat(files, Y.config._cssLoad).forEach(function(v) {
        if (!fileData[v]) {
            //missing.push(v);
        }
    });

    if (missing.length) {
        var fs = require('fs');
        missing.forEach(function(v) {
            fs.readFile(v, encoding='utf8', (function(fileName) {
                return function(err, data) {
                    fileData[fileName] = data;
                    missing.splice(missing.indexOf(fileName), 1);
                    checkComplete();
                }
            })(v));
        });
    } else {
        complete();
    }   

};
