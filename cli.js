#!/usr/bin/env node
process.chdir(__dirname + '/lib/yui3/api/');

try {
    var express = require('express');
} catch (e) {
    console.log('Could not require expressjs; install via: npm install express');
    process.exit();
}
var args = process.argv.slice(2),
arg, key, config = { port: 8100 };

while (arg = args.shift()) {
    if ("--" === arg.substr(0, 2)) {
        key = arg.substr(2).split('=');
        config[key[0]] = key[1];
    }
}

var app = express.createServer();
app.configure(function() {
    app.use(express.staticProvider(process.cwd()));
});
var port = parseInt(config.port);
app.listen(port);
console.log('YUI3 API Docs are available:');
console.log('http://localhost:' + port);
