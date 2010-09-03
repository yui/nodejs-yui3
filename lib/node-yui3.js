var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    // Extract meaning from stack traces
    STACK_FRAME_RE = /.* \(?(.+:\d+:\d+)\)?$/,
    YUI = require('./yui3/build/yui/yui-debug').YUI;

var hasColor = false;
try {
    var stdio = require("stdio");
    hasColor = stdio.isStderrATTY();
} catch (ex) {
    hasColor = true
}


var color = function(str, num) {
    if (!hasColor) {
        return str;
    }
    if (!num) {
        num = '32';
    }
    return "\033[" + num +"m" + str + "\033[0m"
};


var YUI_config = {
    loaderPath: 'loader/loader-debug.js',
    base: __dirname + '/yui3/build/',
    injected: true,
    modules: {
        'nodejs-dom': {
            condition: {
                trigger: 'dom',
                test: function() {
                    return true;
                }
            }
        },
        'io-nodejs': {
            requires: ['io', 'io-xdr', 'nodejs-dom'],
            after: ['io-xdr'],
            condition: {
                trigger: 'io',
                test: function() {
                    return true;
                }
            }
        }
    },
    logFn: function(str, t, m) {
        var id = '';
        if (this.id) {
            id = '[' + this.id + ']:';
        }
        t = t || 'info';
        m = (m) ? color(' (' +  m.toLowerCase() + '):', 35) : '';
        
        if (str instanceof Object || str instanceof Array) {
            //Should we use this?
            if (str.tagName || str._yuid || str._query) {
                str = str.toString();
            } else {
                str = sys.inspect(str);
            }
        }

        var lvl = '37;40', mLvl = ((str) ? '' : 31);

        switch (t.toLowerCase()) {
            case 'error':
                lvl = mLvl = 31;
                break;
            case 'warn':
                lvl = 33;
                break;
            case 'debug':
                lvl = 34;
                break;
        }

        if (str && str.indexOf("\n") !== -1) {
            str = "\n" + str;
        }

        // output log messages to stderr
        sys.error(color(t.toLowerCase() + ':', lvl) + m + ' ' + color(str, mLvl));
    }
};

YUI.docTypes = {
    '5': '<!DOCTYPE html>',
    '4-strict': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
    '4-trans': '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
    'x-strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    'x-trans': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
};

YUI.defaultDocType = '5';

YUI.prototype.__setup = YUI.prototype._setup;
YUI.prototype._setup = function() {
    var self = this;
    this.applyConfig(YUI_config);
    this.__setup.call(self);
};

//ExpressJS view support
YUI.render = function(content, options) {
    
    var eY, locals = options.locals;
    if (locals.instance) {
        eY = locals.instance;
    } else {
        eY = YUI().use('node');
    };

    if (locals.sub) {
        content = eY.Lang.sub(content, locals.sub);
    }
    if (locals.instance) {
        if (!options.isLayout) {
            eY.one('body').prepend(content);
        } else {
            var html = eY.one('body').get('innerHTML');
            eY.one('body').set('innerHTML', content);
            content = html;
        }
    } else {
        eY.one('body').set('innerHTML', content);
    }

    if (options.isLayout) {
        var docType = YUI.defaultDocType;
        if (locals.docType) {
            if (YUI.docTypes[locals.docType]) {
                docType = locals.docType;
            }
        }
        docType = YUI.docTypes[docType];
        var html = docType + "\n";
        var content = eY.one(locals.content);
        if (content && locals.body) {
            content.set('innerHTML', locals.body);
        }
        if (locals.after) {
            locals.after(eY, options, locals.partial);
        }
        html += eY.config.doc.outerHTML;
        return html;
    } else {

        if (locals.yui) {
            locals.yui(eY, options, locals.partial);
        }
        return eY.one('body').get('innerHTML');
    }
    
};

exports.YUI = YUI;

var urlInfoPort = function(urlInfo) {
    return urlInfo.port ? urlInfo.port :
        urlInfo.protocol === 'http:' ? 80 : 443;
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
            req_url = urlInfo.pathname,
            host = http.createClient(urlInfoPort(urlInfo), urlInfo.hostname);

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

YUI.prototype.processCSS = function() {
    var self = this,
        urls = [];

    if (this.config._cssLoad) {
        var newURL = this.Env.meta.base + this.Env.meta.root;
        var reURL = this.config.base;
        this.config._cssLoad.reverse();
        this.config._cssLoad.forEach(function(v, k) {
            urls.push(v.replace(reURL, newURL));
        });
        self.Get.css(urls);
    }
};

//Hack for loadtime Event module.
YUI.config.doc = { documentElement: {} };

YUI.Env._ready = YUI.Env.DOMReady = YUI.Env.windowLoaded = true;

YUI.add('nodejs-dom', function(Y) {
    var jsdom = require('jsdom'),
        dom, browser;

    dom = jsdom.defaultLevel;
    browser = jsdom.windowAugmentation(dom, {
        parser: require('htmlparser')
    });

    browser.document.defaultView.getComputedStyle = function(node) {
        return node.style;
    };

    Y.config.doc = YUI.config.doc = browser.document;
    Y.config.win = YUI.config.win = browser.window;

    browser.window.eval = eval;

    Y.Browser = browser;

    Y.processCSS();

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
        var A = Y.Array,
            urls = A(s), url, i, l = urls.length;
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
                    Y.log('----------------------------------------------------------', 'error', 'nodejsYUI3');
                    if (err.stack) {
                        A.each(err.stack.split('\n'), function(frame) {
                            Y.log(frame, 'error', 'nodejsYUI3');
                        });
                    } else {
                        Y.log(getErrorMessage(err), 'error', 'nodejsYUI3');
                        Y.log('In file: ' + getErrorFilename(err), 'error', 'nodejsYUI3');
                        Y.log('On line: ' + getErrorLine(err), 'error', 'nodejsYUI3');
                    }
                    Y.log('----------------------------------------------------------', 'error', 'nodejsYUI3');
                }
                pass(cb);
            });
        }
    };

    Y.Get.domScript = function(s, cb) {
        var A = Y.Array,
            urls = A(s), url, i, l = urls.length,
            body = Y.get('body');

        for (i=0; i<l; i++) {
            url = urls[i];
            body.append('<script src="' + url + '"></script>');
            if (cb) {
                pass(cb);
            }
        }
    };

    Y.Get.css = function(s, cb) {
        if (!Y.Lang.isArray(s)) {
            s = [s];
        }
        if (!Y.config.win) {
            if (!Y.config._cssLoad) {
                Y.config._cssLoad = [];
            }
            s.forEach(function(v) {
                Y.config._cssLoad.push(v);
                Y.log('Defer Loading CSS: ' + v, 'debug', 'get');
            });
        } else {
            Y.log('Real CSS loading', 'debug', 'get');
            var head = Y.config.doc.getElementsByTagName('head')[0];
            s.forEach(function(link) {
                var l = Y.config.doc.createElement('link');
                l.setAttribute('rel', 'stylesheet');
                l.setAttribute('type', 'text/css');
                l.setAttribute('href', link);
                head.appendChild(l);
            });
        }
        if (cb) {
            pass(cb);
        }
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
                
                var host = http.createClient(urlInfoPort(urlInfo), urlInfo.hostname);
                
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

}, 'NODE', { requires: ['io', 'io-xdr'], after: ['io-xdr'] });


var getErrorMessage = function(e) {
    try {
        return e.message || e.stack.split('\n')[0].trim();
    } catch (e) {
        return 'YUI: failed to get error message';
    }
};

// Get the filename for a given exception
var getErrorFilename = function(e) {
    try {
        var m = e.stack.split('\n')[1].match(STACK_FRAME_RE);
        return m[1].substring(
            0,
            m[1].lastIndexOf(':', m[1].lastIndexOf(':') - 1)
        );
    } catch (e) {
        return 'YUI: failed to get error filename';
    }
};

// Get the line number for a given exception
var getErrorLine = function(e) {
    try {
        var m = e.stack.split('\n')[1].match(STACK_FRAME_RE);
        var parts = m[1].split(':');
        return parseInt(parts[parts.length - 2]);
    } catch (e) {
        return -1;
    }
};

