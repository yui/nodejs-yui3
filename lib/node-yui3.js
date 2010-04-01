
var dom = require("./jsdom").dom.level1.core;
var browser = require("./browser").browserAugmentation(dom);
window = {
    document: new browser.Document()
};
document = window.document;
navigator = {
    userAgent: "node-js"
};


//Create the Root & Nody Node's
var html = document.createElement('html')
html.className = 'yui3-js-enabled';
document.appendChild(html);
document.documentElement.appendChild(document.createElement('body'));
document.documentElement.style = {};
document.documentElement.hasAttribute = true;

var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    url = require('url'),
    htmlparser = require('./node-htmlparser'),
    jsonml = require('./jsonml'),

    // it kind of sucks to rely on a global, and would be better not to.
    // but YUI was written to expect this global to already exist.

    //Use this line if you want local lookups
    //YUI = global.YUI = exports.YUI = require('./yui3/build/yui/yui-debug').YUI;
    
    //This line will let you use remote loading
    YUI = global.YUI = exports.YUI = require('./yui-debug').YUI;
    //YUI = exports.YUI = require('./yui-debug').YUI;

Array.prototype.toString = function() {
    return '[ Array ]: ' + this.length;
};

browser.Element.prototype.focus = function(rawHtml) {
};
browser.Element.prototype.blur = function(rawHtml) {
};

browser.Element.prototype.__defineGetter__('value', function() {
    return this.getAttribute('value') || this.nodeValue;
});

browser.Element.prototype.__defineSetter__('value', function(val) {
    this.nodeValue = val;
    return this.setAttribute('value', val);
});

browser.Element.prototype.__defineGetter__('textContent', function() {
    //sys.puts('get textContent');
    var stripHTML = /<\S[^><]*>/g;
    //sys.puts(this.innerHTML);
    return this.innerHTML.replace(stripHTML, '');
    //return this.innerHTML;
});
browser.Element.prototype.__defineSetter__('textContent', function(txt) {
    //sys.puts('set textContent');
    this.innerHTML = txt;
    return txt;
});

browser.Element.prototype.__defineSetter__('innerHTML', function(rawHtml) {
    //sys.puts('innerHTML Setter');
    rawHtml = rawHtml.replace(/\n/gm, '');
    rawHtml = rawHtml.replace(/  /gm, '');

    //Clear the children first:
    for (var i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i].parentNode) {
            this.childNodes[i].parentNode.removeChild(this.childNodes[i]);
        }
    }
    
    var htmlDom = htmlparser.ParseHtml(rawHtml);
    var count = 0;
    //sys.puts(sys.inspect(htmlDom, false, null));
    var setChild = function(node) {
        //sys.puts('setChild: ' + node.type + ' :: ' + node.raw);
        var newNode;
        if (node.type == 'tag') {
            newNode = this.ownerDocument.createElement(node.name);
        }
        if (node.type == 'text') {
            newNode = this.ownerDocument.createTextNode(node.data);
        }
        if (node.attribs && newNode) {
            for (var c in node.attribs) {
                if (c == 'id') {
                    count++;
                    //sys.puts('setting id: ' + node.attribs[c]);
                }
                newNode.setAttribute(c, node.attribs[c]);
            }
        }
        if (node.children && newNode) {
            for (var c = 0; c < node.children.length; c++) {
                setChild.call(newNode, node.children[c]);
            }
        }
        return this.appendChild(newNode);
    };
    for (var i = 0; i < htmlDom.length; i++) {
        setChild.call(this, htmlDom[i]);
    }
    //sys.puts('set (' + count + ') ids');
    //sys.puts('OUT: ' + this.outerHTML);
    return this.outerHTML;
});



global.YUI_config = {
    win: window,
    doc: document,
    //loaderPath: 'loader/loader-debug.js',
    //base: './yui3/build/',
    injected: true,
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

YUI.Env._ready = YUI.Env.DOMReady = YUI.Env.windowLoaded = true;


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
                
                var host = http.createClient(((urlInfo.protocol === 'http:') ? 80 : 443), urlInfo.hostname);
                
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
