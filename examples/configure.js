#!/usr/bin/env node


var YUIConfig = {
    core: '3.2.0',
    gallery: '2010.09.22',
    '2in3': '0.0.3'
}
var yui3 = require('yui3');
var YUI = yui3.configure(YUIConfig);

console.log(YUI.GlobalConfig.base);
console.log(YUI.GlobalConfig.groups.gallery.base);
console.log(YUI.GlobalConfig.groups.yui2.base);
        
