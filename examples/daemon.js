#!/usr/bin/env node

var YUI = require('yui3').YUI;

YUI({
    debug: true,
    modules: {
        'process': {
            fullpath: __dirname + '/process.js'
        }
    }
}).use('base', 'process', function(Y) {
    var p = new Y.Process({
        workers: 10
    });
    p.on('ready', function() {
        this.message('CHILD PROCESS STARTED FROM READY EVENT');
    });
    p.on('sigcont', function(e) {
        this.message('SIGCONT LISTENER, stopping..');
        e.halt();
    });
    p.on('sigchild', function(e) {
        //this.message('SIGCHILD STOPPED');
        //e.halt();
    });
    p.on('message', function(e) {
        //console.log('Message from (' + e.pid + '): ', e.message);
    });

    p.spawn();
});
