#!/usr/bin/env node
var sys = require('sys'),
    http = require('http'),
    url = require('url'),
    fs = require('fs');

var YUI = require("yui3").YUI;

YUI({
    filter: 'raw',
    _logExclude: {
        'attribute': true,
        'base': true,
        'get': true,
        'loader': true,
        'yui': true,
        'widget': true,
        'event': true
    },
    debug: true
}).use('nodejs-dom', 'node', function(Y) {
    document = Y.Browser.document;
    navigator = Y.Browser.navigator;
    window = Y.Browser.window;
    
    var docType = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">' + "\n";

    http.createServer(function (req, res) {
        var urlInfo = url.parse(req.url, true);
        YUI().use('nodejs-dom', 'node', function(Page) {
            Page.log(sys.inspect(urlInfo));

            Y.log('JSDom testing..');
            document = Page.Browser.document;
            navigator = Page.Browser.navigator;
            window = Page.Browser.window;

            document.title = 'Calendar Test';

            Page.one('body').addClass('yui-skin-sam');

            var ln = document.createElement('link');
            ln.href = "http://yui.yahooapis.com/2in3.1/2.8.0/build/yui2-skin-sam-calendar/assets/skins/sam/yui2-skin-sam-calendar-min.css"
            ln.setAttribute('rel', 'stylesheet');
            ln.setAttribute('type', 'text/css');
            document.getElementsByTagName('head')[0].appendChild(ln);

            var el = document.createElement('div');
            el.id = 'cal1Container';
            document.body.appendChild(el);


            Page.log('Fetching Calendar');
            Page.use('yui2-calendar', function () {
                var YAHOO = Page.YUI2,
                    config = {};
                if (urlInfo.query) {
                    var q = urlInfo.query;
                    if (q.day && q.month && q.year) {
                        config.pagedate = q.month + '/' + q.year;
                        config.selected = q.month + '/' + q.day + '/' + q.year;
                    }
                    if (q.page) {
                        config.pagedate = q.page;
                    }
                }
                var cal1 = new YAHOO.widget.Calendar('cal1', "cal1Container", config);
                cal1.HIDE_BLANK_WEEKS = true;
                cal1.renderEvent.subscribe(function() {
                    var pageDate = cal1.cfg.getProperty('pagedate');
                    var next = YAHOO.widget.DateMath.add(pageDate, 'M', 1);
                    var prev = YAHOO.widget.DateMath.subtract(pageDate, 'M', 1);
                    next = (next.getMonth() + 1) + '/' + next.getFullYear();
                    prev = (prev.getMonth() + 1) + '/' + prev.getFullYear();

                    //Fix up the dom
                    Page.one('#cal1 .calheader .calnavright').set('href', '/?page=' + next);
                    Page.one('#cal1 .calheader .calnavleft').set('href', '/?page=' + prev);
                    var as = Page.all('#cal1 .calcell a');
                    Page.log('Found: ' + as.size());
                    as.each(function(node) {
                        node.set('href', '/?month=' + (pageDate.getMonth() + 1) + '&year=' + pageDate.getFullYear() + '&day=' + node.get('innerHTML'));
                    });

                    var oom = Page.all('#cal1 .calcell.oom');
                    Page.log('Found: ' + oom.size());
                    oom.set('innerHTML', '');

                    Y.log('Done..');
                    res.writeHead(200, {
                        'Content-Type': 'text/html'}
                    );
                    var out = docType + Page.one('doc').get('outerHTML');
                    res.write(out);
                    res.close();

                    Page.log('PAGE: Serving Page');
                });
                cal1.render();
            });
            

        });
    }).listen(8000);

    Y.log('Server running at http://127.0.0.1:8000/');
        
});
