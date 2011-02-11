#!/usr/bin/env node

var html = '<html><title>My Title</title><body>' + 
    '<a href="">Foo</a>' +
    '<a href="">Foo</a>' +
    '<a href="">Foo</a>' +
    '<a href="">Foo</a>' +
    '</body></html>';

require('yui3').fromString(html, function(Y) {
    Y.log('Page Title: ' + Y.one('title').get('innerHTML'));
    Y.log('Anchors: ' + Y.all('a').size());
    Y.log('Lists: ' + Y.all('ol,ul').size());
    Y.log('List Items: ' + Y.all('li').size());
});

