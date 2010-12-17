#!/usr/bin/env node

var sys = require('sys'),
    http = require('http'),
    YUI = require("yui3").YUI;

var DEBUG = true;

YUI({ debug: DEBUG }).use('base', 'nodejs-dom', 'node', function(Y) {
    Y.log('Loaded first instance..');
    
    var docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' + "\n";

    http.createServer(function (req, res) {
        
        YUI({ debug: DEBUG }).use('nodejs-dom', 'node', function(Page) {

            Page.one('title').set('innerHTML', 'Test Page: ' + (new Date()));
            Page.one('body').append('<p>This is a test</p>');

            res.writeHead(200, {
                'Content-Type': 'text/html'}
            );
            var out = docType + Page.one('doc').get('outerHTML');
            //Y.log(out);
            res.write(out);
            res.close();

            Page.log('PAGE: Serving Page');
            //sys.puts(sys.inspect(process.memoryUsage(), true));
        });
        

    }).listen(8000);

    Y.log('Server running at http://127.0.0.1:8000/');

});

