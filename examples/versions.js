#!/usr/bin/env node

var netBinding = process.binding('net'),
    net = require('net'),
    fds = netBinding.socketpair(),
    npm = require('npm'),
    config = {
        exit: false,
        loglevel: 'silent',
        outfd: new net.Stream(fds[0], 'unix'),
        logfd: new net.Stream(fds[1], 'unix')
    };

console.log('Fetching YUI versions from npm, this may take a moment...');

npm.load(config, function() {
    npm.commands.ls(['yui3'], function(err, data) {
        var installed = {};
        for (var i in data) {
            if (i.match(/yui3-/)) {
                var c = i.split('@');
                installed[c[0]] = data[i].data.versions;
            }
        }
        start(installed);
    });
});

var express = require('express'),
        app = express.createServer();

var start = function(mods) {
    var qs = require('querystring');


    var items = {
        'core': {
            q: 'v'
        },
        'gallery': {
            q: 'g'
        },
        '2in3': {
            q: 'yui2'
        }
    };

    app.get('/', function(req, res) {
        var p = req.query,
            out = '',
            helpers = {};

        var modules = '<h1>Installed Packages</h1>';
        for (var i in items) {
            var name = 'yui3-' + i;
            modules += '<h3>' + name + '</h3><ul>';
            for (var v in mods[name]) {
                var m = mods[name][v];
                modules += '<li>' + ((m.installed) ? '<a href="/?' + items[i].q + '=' + v + '">' + v + '</a>' : v) + ((m.installed) ? ' <strong>Installed</strong>' : ' <strong>Not Installed</strong> install via: <code>npm install ' + name + '@' + v + '</code>') + '</li>';
                if (m.installed) {
                    if (!helpers[items[i].q]) {
                        if (p[items[i].q] !== v) {
                            helpers[items[i].q] = v;
                        }
                    }
                }
            }
            modules += '</ul>';
        }

        var YUIConfig = {};
        if (p.v) {
            YUIConfig.core = p.v;
        }
        if (p.g) {
            YUIConfig.gallery = p.g;
        }
        if (p.yui2) {
            YUIConfig['2in3'] = p.yui2;
        }
        var yui3 = require('yui3');
        var YUI = yui3.configure(YUIConfig).YUI;
        
        out += '<h1>YUI Loaded From Config</h1>';
        out += 'Core: ' + YUI.GlobalConfig.base + '<br>';
        if (YUI.GlobalConfig.groups && YUI.GlobalConfig.groups.gallery) {
            out += 'Gallery: ' + YUI.GlobalConfig.groups.gallery.base + '<br>';
        } else {
            out += 'Gallery is not installed: <code>npm install yui3-gallery</code>';
        }
        if (YUI.GlobalConfig.groups && YUI.GlobalConfig.groups.yui2) {
            out += '2in3: ' + YUI.GlobalConfig.groups.yui2.base + '<br><br>';
        } else {
            out += '2in3 is not installed: <code>npm install yui3-2in3</code>';
        }

        var u = 'http:/'+'/localhost:8181/?' + qs.stringify(helpers);
        out += '<strong>Hint:</strong> Try passing a config to the url: <a href="' + u + '">' + u + '</a><br><br>';

        out += modules;

        res.send(out);
    });

    console.log('Done, Server listening: http:/'+'/localhost:8181/');
    app.listen(8181);
};
