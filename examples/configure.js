#!/usr/bin/env node


var YUIConfig = {
    core: '3.3.0',
    gallery: '2010.09.22',
    '2in3': '0.0.3'
};

var yui3 = require('yui3');
var Y = yui3.configure(YUIConfig).useSync('node', 'gallery-torelativetime');

console.log(Y.config.base);
console.log(Y.config.groups.gallery.base);
console.log(Y.config.groups.yui2.base);
        
