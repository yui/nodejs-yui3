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
    "yui3.configure({ core: '3.3.0pr3' }).YUI" : function () {
        var Y = yui3.configure({ core: '3.3.0pr3' }).YUI;
        assert.ok(Y);
        assert.ok(Y.GlobalConfig);
        assert.notEqual(Y.GlobalConfig.base.indexOf('3.3.0pr3'), -1);
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
    "rls-mods": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            //env: 'node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            assert.equal(data.js.length, 31);
            assert.equal(data.css.length, 4);
            assert.equal((data.js.length +  data.css.length), Object.keys(data.d).length);

        });
    },
    "rls-env": function() {
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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
            env: 'node,attribute',
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

