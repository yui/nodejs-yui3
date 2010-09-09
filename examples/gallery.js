#!/usr/bin/env node

var sys = require('sys'),
    YUI = require("yui3").YUI;

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
}).use('nodejs-dom', 'event', 'node', 'gallery-yql', function(Y) {


    new Y.yql('select * from github.user.info where (id = "davglass")', function(r) {
        //Do something here.
        Y.log(r.query, 'debug', 'yql');
    });
    
});
