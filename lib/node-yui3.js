
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

exports.__defineGetter__('YUI', function() {
    var YUI = getYUI();
    return YUI;
});
exports.sync = function() {
    var YUI = getYUI();
    YUI.loadSync = true;
    return YUI();
};
exports.async = function() {
    var YUI = getYUI();
    YUI.loadSync = false;
    return YUI();
};

exports.useSync = function() {
    var YUI = getYUI();
    YUI.loadSync = true;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

exports.use = function() {
    var YUI = getYUI();
    YUI.loadSync = false;
    var Y = YUI();
    return Y.use.apply(Y, arguments);
}

exports.configure = function(c) {
    var YUI = getYUI(c);
    return YUI;
};

/*
process.on('uncaughtException', function (err) {
    if (err.stack) {
        console.log(err.stack);
    } else {
        console.log('Exception: ', err);
    }
});
*/
