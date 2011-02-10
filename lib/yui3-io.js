/**
* A NodeJS transport for IO
* @module io-nodejs
*/
YUI.add('io-nodejs', function(Y) {
    var url = YUI.require('url'),
        http = YUI.require('http');

    var NodeTransport = {
        id: 'nodejs',
        src: {
            send: function(uri, transactionObject, config) {
                //Y.log(sys.inspect(transactionObject), 'info', 'nodeio');
                //Y.log(sys.inspect(config), 'info', 'nodeio');
                
                Y.io.xdrResponse(transactionObject, config, 'start');
                
                var urlInfo = url.parse(uri, parseQueryString=false),
                    p = YUI.urlInfoPort(urlInfo);

                if (!config.headers) {
                    config.headers = {};
                }
                config.headers = Y.merge(_headers, config.headers);
                config.headers.host = urlInfo.hostname + ((p !== 80) ? ':' + p : '');
                config.headers.host = config.headers.host || _headers.host;

                if (config.data && config.method === 'POST') {
                    config.headers['Content-Length'] = config.data.length;
                    config.headers = Y.merge({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }, config.headers);
                }
               
                var host = http.createClient(p, urlInfo.hostname, ((p === 443) ? true : false));
                
                var req_url = urlInfo.pathname;
                if (urlInfo.search) {
                    req_url += urlInfo.search;
                }
                Y.log('Requesting (' + config.method + '): ' + urlInfo.hostname, 'info', 'nodeio');
                Y.log('URL: ' + req_url, 'info', 'nodeio');

                
                var request = host.request(config.method, req_url, config.headers);
                var s = request.socket || request;
                s.addListener('error', function(socketException) {
                    /*ECONNREFUSED*/
                    if (socketException.errno === 61) {
                        Y.log('ECONNREFUSED: connection refused to ' + request.socket.host + ':' + request.socket.port, 'error', 'nodeio');
                    } else {
                        Y.log(socketException, 'error', 'nodeio');
                    }
                    Y.io.xdrResponse(transactionObject, config, 'failure');
                });

                request.addListener('response', function (response) {
                    switch (response.statusCode) {
                        case 301:
                        case 302:
                            if (response.headers.location) {
                                var newUrl = response.headers.location;
                                if (newUrl.substr(0, 1) == '/') {
                                    newUrl = urlInfo.protocol + '/'+'/' + urlInfo.hostname + newUrl;
                                }
                                Y.log('Status code (' + response.statusCode + ') redirecting to: ' + newUrl, 'info', 'nodeio');
                                NodeTransport.src.send(newUrl, transactionObject, config);
                                return;
                            }
                            break;
                    }
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
                        //Y.log(JSON.stringify(transactionObject.c, null, 2), 'warn', 'nodeio');
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

    /**
    * HACK - I don't like this, but this is the only way I can intercept io calls
    * and auto apply the xdr config option.
    */
    var _io = Y.io;
    Y.io = function(url, config) {
        if (!config) {
            config = {};
        }
        config.xdr = { use: 'nodejs' };
        return _io(url, config);
    }
    for (var i in _io) {
        Y.io[i] = _io[i];
    }

    Y.io.transport(NodeTransport);

    var _headers = {};
    Y.io.header = function(name, value) {
        _headers[name] = value;
    };

}, 'NODE', { requires: ['io', 'io-xdr'], after: ['io-xdr'] });

