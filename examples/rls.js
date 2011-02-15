#!/usr/bin/env node
var start = (new Date()).getTime();
var yui3 = require('yui3');
var path = require('path');
yui3.rls({
    //m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable,gallery-aui-toolbar',
    //m: 'yui,loader,dd',
    //m: 'dd',
    m: 'loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
    //env: 'yui',
    //m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
    //env: 'node,attribute',
    //v: 'yui3-core@3.2.0',
    //v: '3.2.0',
    //gv: '2010.09.22',
    //parse: true //This parses the file content and returns it as the last arg
    //gmeta: __dirname + '/gallery-meta.js',
    //yui2meta: __dirname + '/2in3-meta.js',
    //filt: 'debug',
    //'2in3v': '2.8.0',
    GlobalConfig: {
        loaderPath: path.join(__dirname, '..', 'tests', 'extras', '/loader-min.js'),
        debug: true
    }
}, function(err, data) {
    var end = (new Date()).getTime() - start;
    console.log('Callback..');
    console.log(data.js);
    console.log(data.css);
    var size = 0;
    for (var i in data.d) {
        if (data.d[i]) {
            size += data.d[i].length;
            console.log('i: ', i, (data.d[i].length));
        }
    }
    console.log('Total: ', [].concat(data.js, data.css).length);
    console.log('Total JS: ', data.js.length);
    console.log('Total CSS: ', data.css.length);
    console.log('Data: ', Object.keys(data.d).length);
    console.log('Size: (bytes)', size);
    console.log('Time: %sms', end);
    
});


