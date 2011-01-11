#!/usr/bin/env node

var yui3 = require('yui3');
yui3.rls({
    m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
    //m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
    //env: 'node,attribute',
    v: '3.3.0pr3',
    gv: '2010.09.22',
    '2in3v': '0.0.3'//,
    //filt: 'RAW',
}, function(files) {
    console.log('Callback..');
    console.log(files);
});

