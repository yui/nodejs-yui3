#!/usr/bin/env node
var start = (new Date()).getTime();
var yui3 = require('yui3');
yui3.rls({
    m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable,gallery-aui-toolbar',
    //m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
    //env: 'node,attribute',
    v: '3.3.0',
    //v: '3.2.0',
    gv: '2010.09.22',
    //parse: true, //This parses the file content and returns it as the last arg
    gmeta: __dirname + '/gallery-meta.js',
    yui2meta: __dirname + '/2in3-meta.js',
    //filt: 'debug',
    '2in3v': '2.8.0'
}, function(js, css, data) {
    var end = (new Date()).getTime() - start;
    console.log('Callback..');
    console.log(js);
    console.log(css);
    var size = 0;
    for (var i in data) {
        if (data[i]) {
            size += data[i].length;
            console.log('i: ', i, (data[i].length));
        }
    }
    console.log('Total: ', [].concat(js, css).length);
    console.log('Data: ', Object.keys(data).length);
    console.log('Size: (bytes)', size);
    console.log('Time: %sms', end);
    
});

