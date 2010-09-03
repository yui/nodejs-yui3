#!/usr/bin/env node

var express = require('express');
process.chdir(__dirname + '/lib/yui3/api/');

var app = express.createServer();
app.configure(function() {
    app.use(express.staticProvider(process.cwd()));
});
app.listen(8000);
console.log('YUI3 API Docs are available:');
console.log('http://localhost:8000');
