#!/usr/bin/env node


var start = (new Date()).getTime();
var yui3 = require('yui3');
yui3.rls({
    //m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
    m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
    env: 'node,attribute',
    v: '3.3.0',
    gv: '2010.09.22',
    '2in3v': '0.0.3'//,
    //filt: 'RAW',
}, function(js, css, data) {
    var end = (new Date()).getTime() - start;
    console.log('Callback..');
    console.log(js);
    console.log(css);
    var size = 0;
    for (var i in data) {
        size += data[i].length;
        console.log('i: ', i, (data[i].length));
    }
    console.log('Total: ', [].concat(js, css).length);
    console.log('Data: ', Object.keys(data).length);
    console.log('Size: (bytes)', size);
    console.log('Time: %sms', end);
    
});

