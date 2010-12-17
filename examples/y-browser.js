#!/usr/bin/env node

var sys = require('sys'),
    YUI = require("yui3").YUI;

YUI({
    filter: 'debug',
    _logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: false
}).use('nodejs-dom', 'node', function(Y) {
    
    var document = Y.Browser.document;
    var window = Y.Browser.window;
    var self = Y.Browser.self;
    var navigator = Y.Browser.navigator;
    var location = Y.Browser.location;

    document.title = 'Example #1';

    //With the local aliases
    var el = document.createElement('div');
    el.id = 'foo';
    el.innerHTML = '<em>This is a test</em> This <strong class="odd">is another</strong> test ';
    document.body.appendChild(el);


    //SCOPED
    var el2 = Y.Browser.document.createElement('div');
    el2.id = 'foo2bar';
    el2.innerHTML = '<em class="odd">This is a test</em> This <strong>is another</strong> test ';
    Y.Browser.document.body.appendChild(el2);

    sys.puts('getElementByid(foo2bar): ' + Y.Browser.document.getElementById('foo2bar'));
    sys.puts('getElementByid(foo): ' + Y.Browser.document.getElementById('foo'));
    sys.puts('getElementByTagName(em): ' + Y.Browser.document.getElementsByTagName('em'));
    sys.puts('getElementByClassName(odd): ' + Y.Browser.document.getElementsByClassName('odd'));

    sys.puts('');
    sys.puts('Y.Browser.document.outerHTML: ');
    sys.puts(Y.Browser.document.outerHTML);
});

YUI({
    filter: 'debug',
    _logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: false
}).use('nodejs-dom', 'node', function(Y) {
    
    var document = Y.Browser.document;
    var window = Y.Browser.window;
    var self = Y.Browser.self;
    var navigator = Y.Browser.navigator;
    var location = Y.Browser.location;

    document.title = 'Example #2';

    //With the local aliases
    var el = document.createElement('div');
    el.id = 'foo';
    el.innerHTML = '<em>This is a test</em> This <strong class="odd">is another</strong> test ';
    document.body.appendChild(el);


    //SCOPED
    var el2 = Y.Browser.document.createElement('div');
    el2.id = 'foo2bar';
    el2.innerHTML = '<em class="odd">This is a test</em> This <strong>is another</strong> test ';
    Y.Browser.document.body.appendChild(el2);

    sys.puts('getElementByid(foo2bar): ' + Y.Browser.document.getElementById('foo2bar'));
    sys.puts('getElementByid(foo): ' + Y.Browser.document.getElementById('foo'));
    sys.puts('getElementByTagName(em): ' + Y.Browser.document.getElementsByTagName('em'));
    sys.puts('getElementByClassName(odd): ' + Y.Browser.document.getElementsByClassName('odd'));

    sys.puts('');
    sys.puts('Y.Browser.document.outerHTML: ');
    sys.puts(Y.Browser.document.outerHTML);

});
