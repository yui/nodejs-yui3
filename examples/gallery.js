#!/usr/bin/env node

var sys = require('sys'),
    yui3 = require("yui3");

//YUI = yui3.YUI;

YUI = yui3.configure({
    gallery: '2010.09.22'
});

YUI3 = yui3.configure({
    gallery: '2010.09.22'
});


YUI({
    debug: true
}).use('node', 'gallery-yql', function(Y) {


    new Y.yql('select * from github.user.info where (id = "davglass")', function(r) {
        //Do something here.
        Y.log(r.query, 'debug', 'yql');
    });
    
});
