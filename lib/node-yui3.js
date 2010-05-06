var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    YUI = require('./yui-debug').YUI;


var YUI_config = {
    loaderPath: 'loader/loader-debug.js',
    base: './yui3/build/',
    injected: true,
    useBrowserConsole: true,
    logFn: function(str, t, m) {
        t = t || 'info';
        m = (m) ? '(' +  m+ ') ' : '';
        var o = false;
        if (str instanceof Object || str instanceof Array) {
            //Should we use this?
            if (str.toString) {
                str = str.toString();
            } else {
                str = sys.inspect(str);
            }
        }
        // output log messages to stderr
        sys.error('[' + t.toUpperCase() + ']: ' + m + str);
    }
};

exports.YUI = function(config) {
    return YUI(YUI_config, config);
};


YUI.include = function(file, cb) {
    var loaderFn = function(err, data) {
        if (err) {
            cb(err);
        } else {
            try {
                var mod = "(function(YUI) { " + data + " return YUI; })",
                    fn = process.compile(mod, file);

                YUI = fn(YUI);
                cb(null, YUI);
            } catch(err) {
                cb(err);
            }
        }
    };
    if (file.match(/^https?:\/\//)) {

        var urlInfo = url.parse(file, parseQueryString=false),
            host = http.createClient(((urlInfo.protocol === 'http:') ? 80 : 443), urlInfo.hostname),
            req_url = urlInfo.pathname;

        if (urlInfo.search) {
            req_url += urlInfo.search;
        }
        var request = host.request('GET', req_url, { host: urlInfo.hostname });

        request.addListener('response', function (response) {
            var data = '';
            response.addListener('data', function (chunk) {
                data += chunk;
            });
            response.addListener("end", function() {
                loaderFn(null, data);
            });
        });
        if (request.end) {
            request.end();
        } else {
            request.close();
        }
        
    } else {
        fs.readFile(file, encoding='utf8', loaderFn);
    }
};

//Hack for loadtime Event module.
YUI.config.doc = { documentElement: {} };

YUI.Env._ready = YUI.Env.DOMReady = YUI.Env.windowLoaded = true;

YUI.add('nodejs-dom', function(Y) {
    var dom = require('jsdom').dom.level1.core,
        browser = require('browser').windowAugmentation(dom);

    Y.config.doc = YUI.config.doc = browser.document;
    Y.config.win = YUI.config.win = browser.window;

    Y.Browser = browser;

}, 'NODE', { requires: ['yui-base'], after: ['yui-base'] });

YUI.add('get', function(Y) {
    
    var end = function(cb, msg, result) {
        //Y.log('Get end: ' + cb.onEnd);
        if (Y.Lang.isFunction(cb.onEnd)) {
            cb.onEnd.call(Y, msg, result);
        }
    }, pass = function(cb) {
        //Y.log('Get pass: ' + cb.onSuccess);
        if (Y.Lang.isFunction(cb.onSuccess)) {
            cb.onSuccess.call(Y, cb);
        }
        end(cb, 'success', 'success');
    }, fail = function(cb, er) {
        //Y.log('Get fail: ' + er);
        if (Y.Lang.isFunction(cb.onFailure)) {
            cb.onFailure.call(Y, er, cb);
        }
        end(cb, er, 'fail');
    };

    Y.Get = function() {};

    Y.Get.script = function(s, cb) {
        var urls = Y.Array(s), url, i, l = urls.length;
        for (i=0; i<l; i++) {
            url = urls[i];
            if (!urls[i].match(/^https?:\/\//)) {
                if (url.substr(0, 12) === './yui3/build') {
                    //If it's a YUI loaded file, get it from this directory, else use the default path
                    url = path.join(__dirname, url);
                }
            }
            Y.log('URL: ' + url, 'info', 'get');
            // doesn't need to be blocking, so don't block.
            YUI.include(url, function(err) {
                Y.log('Loaded: ' + url, 'info', 'get');
                if (err) {
                    Y.log('----------------------------------------------------------', 'error', 'get');
                    Y.log(err, 'error', 'get');
                    Y.log('In file: ' + url, 'error', 'get');
                    Y.log('----------------------------------------------------------', 'error', 'get');
                }
                pass(cb);
            });
        }
    };
    //Just putting this is so we don't get errors
    Y.Get.css = function(s, cb) {
        Y.log('Not Loading CSS: ' + s, 'debug', 'get');
        pass(cb);
    };
});


YUI.add('io-nodejs', function(Y) {

    var NodeTransport = {
        id: 'nodejs',
        src: {
            send: function(uri, transactionObject, config) {
                //Y.log(sys.inspect(transactionObject), 'info', 'nodeio');
                //Y.log(sys.inspect(config), 'info', 'nodeio');
                
                Y.io.xdrResponse(transactionObject, config, 'start');
                
                var urlInfo = url.parse(uri, parseQueryString=false);
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers.host = urlInfo.hostname;

                if (config.data && config.method === 'POST') {
                    config.headers['Content-Length'] = config.data.length;
                    config.headers = Y.merge({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, config.headers);
                }
                
                //sys.print(sys.inspect(urlInfo));
                var port = ((urlInfo.protocol === 'http:') ? 80 : 443);
                if (urlInfo.port) {
                    port = urlInfo.port;
                }
                
                var host = http.createClient(port, urlInfo.hostname);
                
                var req_url = urlInfo.pathname;
                if (urlInfo.search) {
                    req_url += urlInfo.search;
                }
                Y.log('Requesting (' + config.method + '): ' + urlInfo.hostname, 'info', 'nodeio');
                Y.log('URL: ' + req_url, 'info', 'nodeio');

                
                var request = host.request(config.method, req_url, config.headers);
                request.addListener('response', function (response) {
                    //sys.puts("STATUS: " + response.statusCode);
                    //sys.puts("HEADERS: " + JSON.stringify(response.headers));
                    //response.setBodyEncoding("utf8");
                    var body = '';
                    response.addListener('data', function (chunk) {
                        //sys.puts('chunk: ' + chunk);
                        body += chunk;
                    });
                    response.addListener("end", function() {
                        var statusText, good, status = response.statusCode;

                        if (status >= 200 && status < 300) {
                            statusText = 'OK';
                            good = true;
                        } else {
                            statusText = 'Server Error';
                            good = false;
                        }

                        transactionObject.c = {
                            status: response.statusCode,
                            statusText: statusText,
                            responseText: body,
                            headers: response.headers,
                            getAllResponseHeaders: function() {
                                return this.headers;
                            },
                            getResponseHeader: function(h) {
                                return this.headers[h];
                            }
                        }
                        //sys.print(sys.inspect(transactionObject.c));

                    
                        Y.io.xdrResponse(transactionObject, config, 'complete');
                        Y.io.xdrResponse(transactionObject, config, ((good) ? 'success' : 'failure'));
                    
                        //TODO
                        //Y.io.xdrResponse(transactionObject, configurationObject, 'timeout');
                    });

                });
                if (config.method === 'POST') {
                    request.write(config.data);
                }
                if (request.end) {
                    request.end();
                } else {
                    request.close();
                }
            },
            abort: function() {
                //TODO
            },
            isInProgress: function() {
                //TODO
                return false;
            }
        }
    };

    Y.io.transport(NodeTransport);

}, 'NODE', { requires: ['io-xdr'] });
