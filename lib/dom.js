/**
* Module loads jsdom & htmlparser support into YUI. Should be autoloaded once DOM is needed.
* @module nodejs-dom
*/
YUI.add('nodejs-dom', function(Y) {
    var jsdom = YUI.require('jsdom'),
        parser = null,
        browser, dom;
    
    //Cache the htmlparser require.
    if (!YUI._htmlparser) {
        YUI._htmlparser = YUI.require('htmlparser');
    }
    parser = YUI._htmlparser;
    
    dom = jsdom.defaultLevel;

    browser = jsdom.windowAugmentation(dom, {
        parser: parser
    });

    browser.window.eval = eval;

    if (Y.config.UA) {
        browser.window.navigator.userAgent = Y.config.UA;
    }

    Y.config.doc = browser.window.document;
    Y.config.win = browser.window;

    if (Y.config.UA) {
        Y.UA = YUI.Env.parseUA();
    }
    
    Y.Browser = browser;

    Y.processCSS();

}, 'NODE', { requires: ['oop'], after: ['oop'] } );

