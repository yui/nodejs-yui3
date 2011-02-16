var yui3 = require("../lib/node-yui3");
var YUITest = require("yuitest").YUITest;

var Assert = YUITest.Assert,
    ArrayAssert = YUITest.ArrayAssert,
    suite = new YUITest.TestSuite("YUI");


suite.add( new YUITest.TestCase({
    name: 'Interface',
    "yui3 useSync" : function () {
        var Y = yui3.silent().useSync("loader");
        Assert.isObject(Y.Loader);
    },
    "yui3 configure useSync" : function () {
        var Y = yui3.configure({ debug: false }).useSync("loader");
        Assert.isObject(Y.Loader);
    },
    "yui3 YUI" : function () {
        var Y = yui3.YUI;
        Assert.isObject(Y);
        Assert.isUndefined(Y.Loader);
    },
    "yui3 configure YUI" : function () {
        var Y = yui3.configure({}).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.isUndefined(Y.Loader);
    },
    "yui3 configure core 320 YUI" : function () {
        var Y = yui3.configure({ core: '3.2.0' }).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.areNotEqual(Y.GlobalConfig.base.indexOf('3.2.0'), -1);
        Assert.isUndefined(Y.Loader);
    },
    "yui3 configure core 330 YUI" : function () {
        var Y = yui3.configure({ core: '3.3.0' }).YUI;
        Assert.isObject(Y);
        Assert.isObject(Y.GlobalConfig);
        Assert.areNotEqual(Y.GlobalConfig.base.indexOf('3.3.0'), -1);
        Assert.isUndefined(Y.Loader);
    },
    //I HATE THIS !!!
    "yui3 use" : function () {
        var loaded = false, eY;
        yui3.silent().use("loader", function (Y) {
            loaded = true;
            eY = Y;
        });
        var w = function() {
            if (loaded) {
                Assert.isObject(eY.Loader);
            } else {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    //I HATE THIS !!!
    "yui3 configure use" : function () {
        var loaded = false, eY;
        yui3.configure({ debug: false }).use("loader", function (Y) {
            loaded = true;
            eY = Y;
        });
        var w = function() {
            if (loaded) {
                Assert.isObject(eY.Loader);
            } else {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    }
}));


suite.add( new YUITest.TestCase({
    name: 'RLS',
    //I HATE ALL OF THESE ASYNC TESTS !!!
    "rls full": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,loader,dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 33);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    //No ENV, should return YUI module
    "rls mods no env": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 32);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual((data.js.length +  data.css.length), Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls yui loader": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 14);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls yui noloader": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 13);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls yui customloader no serve loader": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            Assert.areEqual(data.js.length, 13);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls yui customloader debug": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-debug.js'
            }
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-debug.js');
            Assert.areEqual(data.js.length, 13);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    //Custom loader should only be used on the server, it should not be served.
    "rls yui customloader serve loader": function() {
        var loaded = false;
        yui3.rls({
            m: 'yui,loader,dd',
            v: '3.3.0',
            GlobalConfig: {
                loaderPath: __dirname + '/extras/loader-min.js'
            }
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.Y.config.loaderPath, __dirname + '/extras/loader-min.js');
            Assert.areNotEqual(data.Y.config.loaderPath, data.js[1]);
            Assert.areEqual(data.Y.config._loaderPath, data.js[1]);
            Assert.areEqual(data.js.length, 14);
            Assert.areEqual(data.css.length, 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls env": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'//,
            //filt: 'RAW',
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls filter raw": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'RAW'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls filter min": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'MIN'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager-min.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls filter debug": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0',
            filt: 'DEBUG'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[1].indexOf('classnamemanager-debug.js') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls version 33": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,autocomplete,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.3.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 27);
            Assert.areEqual(data.css.length, 4);
            Assert.isTrue(data.js[0].indexOf('3.3.0') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls version 32": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            v: '3.2.0',
            parse: true,
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            Assert.isTrue(data.js[0].indexOf('3.2.0') > 0);
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls version gallery": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.2.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-gallery') > -1) {
                    Assert.isTrue(v.indexOf('2010.09.22') > 0);
                }
            });
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    },
    "rls version yui2": function() {
        var loaded = false;
        yui3.rls({
            m: 'dd,widget,gallery-yql,yui2-datatable',
            env: 'yui,node,attribute',
            parse: true,
            v: '3.2.0',
            gv: '2010.09.22',
            '2in3v': '2.8.0'
        }, function(err, data) {
            loaded = true;
            Assert.areEqual(data.js.length, 16);
            Assert.areEqual(data.css.length, 2);
            data.js.forEach(function(v) {
                if (v.indexOf('yui3-2in3') > -1) {
                    Assert.isTrue(v.indexOf('2.8.0') > 0);
                }
            });
            Assert.areEqual([].concat(data.js, data.css).length, Object.keys(data.d).length);
        });
        var w = function() {
            if (!loaded) {
                this.wait(w, 50);
            }
        };
        this.wait(w, 50);
    }

}));


YUITest.TestRunner.add(suite);
