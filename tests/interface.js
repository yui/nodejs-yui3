#!/usr/bin/env node

var assert = require("assert"),
    yui3 = require("../lib/node-yui3");

module.exports = {
    "yui3.useSync" : function () {
        var Y = yui3.silent().useSync("loader");
        assert.ok(Y.Loader);
    },
    "yui3.configure({}).useSync" : function () {
        var Y = yui3.configure({ debug: false }).useSync("loader");
        assert.ok(Y.Loader);
    },
    "yui3.YUI" : function () {
        var Y = yui3.YUI;
        assert.ok(Y);
        assert.isUndefined(Y.Loader);
    },
    "yui3.configure({}).YUI" : function () {
        var Y = yui3.configure({}).YUI;
        assert.ok(Y);
        assert.ok(Y.GlobalConfig);
        assert.isUndefined(Y.Loader);
    },
    "yui3.configure({ core: '3.2.0' }).YUI" : function () {
        var Y = yui3.configure({ core: '3.2.0' }).YUI;
        assert.ok(Y);
        assert.ok(Y.GlobalConfig);
        assert.notEqual(Y.GlobalConfig.base.indexOf('3.2.0'), -1);
        assert.isUndefined(Y.Loader);
    },
    "yui3.configure({ core: '3.3.0' }).YUI" : function () {
        var Y = yui3.configure({ core: '3.3.0' }).YUI;
        assert.ok(Y);
        assert.ok(Y.GlobalConfig);
        assert.notEqual(Y.GlobalConfig.base.indexOf('3.3.0'), -1);
        assert.isUndefined(Y.Loader);
    },
    "yui3.use" : function () {
        yui3.silent().use("loader", function (Y) {
            assert.ok(Y.Loader);
        });
    },
    "yui3.configure({}).use" : function () {
        yui3.configure({ debug: false }).use("loader", function (Y) {
            assert.ok(Y.Loader);
        });
    },
    "rls-full": function() {
        yui3.rls({
            m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            assert.equal(data.js.length, 33);
            assert.equal(data.css.length, 4);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    //No ENV, should return YUI module
    "rls-mods": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            assert.equal(data.js.length, 32);
            assert.equal(data.css.length, 4);
            assert.equal((data.js.length +  data.css.length), Object.keys(data.d).length);

        });
    },
    "rls-yui-loader": function() {
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0'
        }, function(err, data) {
            assert.equal(data.js.length, 14);
            assert.equal(data.css.length, 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-yui-noloader": function() {
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0'
        }, function(err, data) {
            assert.equal(data.js.length, 13);
            assert.equal(data.css.length, 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-yui-customloader-no-serve-loader": function() {
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            assert.equal(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            assert.equal(data.js.length, 13);
            assert.equal(data.css.length, 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    //Custom loader should only be used on the server, it should not be served.
    "rls-yui-customloader-serve-loader": function() {
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            assert.equal(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            assert.notEqual(data.Y.config.loaderPath, data.js[1]);
            assert.equal(data.Y.config._loaderPath, data.js[1]);
            assert.equal(data.js.length, 14);
            assert.equal(data.css.length, 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-env": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            assert.equal(data.js.length, 27);
            assert.equal(data.css.length, 4);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-filter-raw": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'RAW'
        }, function(err, data) {
            assert.equal(data.js.length, 27);
            assert.equal(data.css.length, 4);
            assert.ok(data.js[1].indexOf('classnamemanager.js') > 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-filter-min": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'MIN'
        }, function(err, data) {
            assert.equal(data.js.length, 27);
            assert.equal(data.css.length, 4);
            assert.ok(data.js[1].indexOf('classnamemanager-min.js') > 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-filter-debug": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'DEBUG'
        }, function(err, data) {
            assert.equal(data.js.length, 27);
            assert.equal(data.css.length, 4);
            assert.ok(data.js[1].indexOf('classnamemanager-debug.js') > 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-version-33": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            assert.equal(data.js.length, 27);
            assert.equal(data.css.length, 4);
            assert.ok(data.js[0].indexOf('3.3.0') > 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-version-32": function() {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.2.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            assert.equal(data.js.length, 16);
            assert.equal(data.css.length, 2);
            assert.ok(data.js[0].indexOf('3.2.0') > 0);
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-version-gallery": function() {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.2.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            assert.equal(data.js.length, 16);
            assert.equal(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-gallery') > -1) {
                    assert.ok(v.indexOf('2010.09.22') > 0);
                }
            });
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    },
    "rls-version-yui2": function() {
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.2.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            assert.equal(data.js.length, 16);
            assert.equal(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-2in3') > -1) {
                    assert.ok(v.indexOf('2.8.0') > 0);
                }
            });
            assert.equal([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
    }
};

