/**
* Module loads jsdom & htmlparser support into YUI. Should be autoloaded once DOM is needed.
* @module nodejs-dom
*/
YUI.add('nodejs-dom', function(Y) {
    var jsdom = YUI.require('jsdom'),
        browser, dom;
    
    dom = jsdom.defaultLevel;
    browser = jsdom.windowAugmentation(dom, {
        parser: YUI.require('htmlparser')
    });

    browser.window.eval = eval;

    Y.config.doc = browser.window.document;
    Y.config.win = browser.window;
    
    Y.Browser = browser;

    Y.processCSS();

}, 'NODE', { requires: ['yui-base'], after: ['yui-base'] });

