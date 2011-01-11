#!/usr/bin/env node

var YUIConfig = {
    core: '3.2.0',
    //core: '3.3.0pr3',
    gallery: '2010.09.22',
    '2in3': '0.0.3'
};

var yui3 = require('yui3');

yui3.rls({
    //m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
    m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
    env: 'node,attribute',
    v: '3.2.0',
    gv: '2010.09.22',
    '2in3v': '0.0.3',
    filt: 'DEBUG',
}, function(files) {
    console.log('Callback..');
    console.log(files);
});

