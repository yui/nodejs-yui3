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
    debug: true
}).use('node', function(Y) {

    Y.log('JSDom testing..');
    //sys.puts('Inside1: ' + sys.inspect(process.memoryUsage()));
    var document = Y.Browser.document;

    var i = Y.Node.create('<i>Test This</i>');
    i.addClass('foo');
    Y.one('body').append(i);

    var div = document.createElement('div');
    div.id = 'foo';
    div.innerHTML = '<em id="foo">Test</em> this <strong id="bax">awesome <u id="foo:bar">shit..</u></strong>';
    document.body.appendChild(div);
    
    var foo = Y.one('#foo');
    foo.addClass('bar');

    Y.log(document.getElementById('foo').outerHTML, 'info', 'GEBI');
    Y.log(document.getElementById('bax').outerHTML, 'info', 'GEBI');

    //sys.puts('Inside2: ' + sys.inspect(process.memoryUsage()));
    Y.log(Y.Node.getDOMNode(Y.one('strong')), 'info');
    Y.log(Y.all('em, #bax').toString(), 'info');
    Y.log(Y.Node.getDOMNode(Y.one('strong')), 'info');
    
    Y.log(Y.all('em, u').toString(), 'info');
    Y.log(Y.all('#foo, em, u, #bax'), 'info');
    //sys.puts('Inside3: ' + sys.inspect(process.memoryUsage()));

    Y.log(i.toString(), 'info', 'node-instance');
    Y.log(Y.Node.getDOMNode(i).outerHTML, 'info', 'HTML');
    Y.log(foo.toString(), 'info', 'node-instance');
    Y.log(foo.get('className'), 'info', 'classname');
    Y.log(Y.Node.getDOMNode(foo).outerHTML, 'info', 'HTML');

    Y.log(Y.one('body'), 'info', 'BODY');
    Y.log(Y.all('body, div', null, true), 'info', 'BODY');

    Y.log(document.body.outerHTML, 'info', 'HTML');
    Y.log(document.getElementById('foo\:bar'), 'info', 'HTML');
    Y.log(document.getElementById('foo:bar'), 'info', 'HTML');


    Y.log(document.parentNode, 'info', 'document.parentNode');

    Y.log(document.outerHTML, 'info', 'document.outerHTML');

    //Y.log(document.getElementById('bax').outerHTML, 'HTML');
    
});
