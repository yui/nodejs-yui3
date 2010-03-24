var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),

    // it kind of sucks to rely on a global, and would be better not to.
    // but YUI was written to expect this global to already exist.

    //Use this line if you want local lookups
    //YUI = global.YUI = exports.YUI = require('./yui3/build/yui/yui-debug').YUI;
    
    //This line will let you use remote loading
    YUI = global.YUI = exports.YUI = require('./yui-debug').YUI;
    //YUI = exports.YUI = require('./yui-debug').YUI;
    
global.YUI_config = {
    //loaderPath: 'loader/loader-debug.js',
    //base: './yui3/build/',
    useBrowserConsole: true,
    logFn: function(str, t, m) {
        t = t || 'info';
        m = (m) ? '(' +  m+ ') ' : '';
        var o = false;
        if (str instanceof Object || str instanceof Array) {
            //Should we use this?
            str = sys.inspect(str);
        }
        // output log messages to stderr
        sys.error('[' + t.toUpperCase() + ']: ' + m + str);
    }
};

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
                url = url.replace(/\.js$/, '');
            }
            Y.log('URL: ' + url, 'info', 'get');
            // doesn't need to be blocking, so don't block.
            require.async(url, function (mod) {
                pass(cb);
            });
        }
    };
    //Just putting this is so we don't get errors
    Y.Get.css = function(s, cb) {
        Y.log('Loading CSS: ' + s, 'debug', 'get');
        pass(cb);
    };
});


YUI.add('io-nodejs', function(Y) {
    
    

    var NodeTransport = {
        id: 'nodejs',
        src: {
            send: function(uri, transactionObject, config) {
                //sys.print(sys.inspect(transactionObject));
                
                Y.io.xdrResponse(transactionObject, config, 'start');
                
                var urlInfo = url.parse(uri, parseQueryString=false);
                //sys.print(sys.inspect(urlInfo));
                
                var host = http.createClient(((urlInfo.protocol === 'http:') ? 80 : 443), urlInfo.hostname);
                
                var req_url = urlInfo.pathname;
                    if (urlInfo.search) {
                        req_url += urlInfo.search;
                    }
                
                var request = host.request(config.method, req_url, { "host": urlInfo.hostname });
                request.addListener('response', function (response) {
                    //sys.puts("STATUS: " + response.statusCode);
                    //sys.puts("HEADERS: " + JSON.stringify(response.headers));
                    response.setBodyEncoding("utf8");
                    var body = '';
                    response.addListener("data", function (chunk) {
                        body += chunk;
                    });
                    response.addListener("end", function() {
                        var statusText, good, status = response.statusCode;

                        if (status >= 200 && status < 300 || status === 1223) {
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
                request.close();
                

                /* {{{
                if (configurationObject.arguments === 'success') {

                    transactionObject.c = {
                        status: 200,
                        statusText: 'OK',
                        responseText: 'This is a successful transaction.'
                    }

                    Y.io.xdrResponse(transactionObject, configurationObject, 'complete');
                    Y.io.xdrResponse(transactionObject, configurationObject, 'success');
                } else if (configurationObject.arguments === 'failure') {

                    transactionObject.c = {
                        status: 500,
                        statusText: 'Server Error',
                        responseText: 'This is a unsuccessful transaction.'
                    }

                    Y.io.xdrResponse(transactionObject, configurationObject, 'complete');
                    Y.io.xdrResponse(transactionObject, configurationObject, 'failure');
                } else if (configurationObject.arguments === 'timeout') {
                    Y.io.xdrResponse(transactionObject, configurationObject, 'timeout');
                }
                }}}*/
            
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
