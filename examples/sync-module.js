#!/usr/bin/env node

var YUI = require("yui3").YUI;

YUI.loadSync = true;

YUI({
    filter: 'debug',
    _logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('yql', function(Ysync) {

    module.exports = Ysync;
    
});
