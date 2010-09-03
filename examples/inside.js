#!/usr/bin/env node

var sys = require('sys');

var YUI = require("yui3").YUI;

require("assert").equal( global.YUI, undefined, "global yui created");

YUI({
    filter: 'debug',
    debug: true
}).use('json', 'base', 'io-nodejs', 'yql', function(Y) {

    console.log('YQL1: ', Y.YQL);
    var Y2 = YUI({ filter: 'debug', debug: true }).use('*');
    console.log('YQL2: ', Y2.YQL);

});
