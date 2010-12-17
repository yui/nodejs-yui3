#!/usr/bin/env node

var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    YUI = require("yui3").YUI;

var DEBUG = true;

YUI({ debug: DEBUG }).use('base', 'nodejs-dom', 'node', 'gallery-yql', 'json-stringify', function(Y) {
    Y.log('Loaded first instance..');
    
    var docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' + "\n";

    http.createServer(function (req, res) {
        
        YUI({ debug: DEBUG }).use('nodejs-dom', 'node', 'gallery-yql', 'json-stringify', function(Page) {
            //This is an example, normally we would use HTML templates.
            //Some JSON data to work on the template.
            var data = {
                TITLE: 'Test Page: ' + (new Date()),
                PARAS: [
                    'This is some test',
                    'This is some test',
                    'This is some test',
                    'This is some test',
                    'This is some test',
                    'This is some test'
                ]
            };
            Page.one('title').set('innerHTML', data.TITLE);


            var body = Page.one('body');
            body.append('<p>The content below is dynamically generated on the server.<br>You can access this code in 3 different ways:<ul><li>Like this as a full page</li><li><a href="/html">Or as just the content</a></li><li><a href="/json">Or as just the JSON data</a></li></ul></p>');
            body.append('<div id="wrapper"></div>');

            var el = Page.one('#wrapper');

            Y.each(data.PARAS, function(v, k) {
                el.append('<p>' + v + ' : #' + k + '</p>');
            });

            var out = '', contentType = 'text/html';
            switch (req.url) {
                case '/json':
                    out = Page.JSON.stringify(data);
                    contentType = 'text/plain';
                    break;
                case '/html':
                    out = el.get('innerHTML');
                    break;
                default: 
                    out = docType + Page.one('doc').get('outerHTML');
            }
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.write(out);
            res.close();

            Page.log('PAGE: Serving Page');
        });
        

    }).listen(8000);

    Y.log('Server running at http://127.0.0.1:8000/');

});

