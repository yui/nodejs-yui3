var hasColor = false;
try {
    var stdio = require("stdio");
    hasColor = stdio.isStderrATTY();
} catch (ex) {
    hasColor = true;
}

var sys = require('sys');

module.exports = {
    useColor: hasColor,
    groups: {},
    loaderPath: 'loader/loader-debug.js',
    injected: true,
    modules: {
        'parallel': {
            requires: ['oop'],
            fullpath: __dirname + '/yui3-parallel.js',
            condition: {
                when: 'after',
                trigger: 'oop',
                test: function() {
                    return true
                }
            }
        },
        'express': {
            requires: ['substitute', 'node'],
            fullpath: __dirname + '/yui3-express.js'
        },
        'nodejs-dom': {
            fullpath: __dirname + '/yui3-dom.js',
            condition: {
                when: 'before',
                trigger: 'dom-base',
                test: function() {
                    return true;
                }
            }
        },
        'nodejs-node': {
            requires: ['node'],
            fullpath: __dirname + '/yui3-node.js',
            condition: {
                when: 'after',
                trigger: 'node',
                test: function() {
                    return true;
                }
            }
        },
        'io-nodejs': {
            fullpath: __dirname + '/yui3-io.js',
            condition: {
                when: 'after',
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
        m = (m) ? this.consoleColor(' (' +  m.toLowerCase() + '):', 35) : '';
        
        if (str === null) {
            str = 'null';
        }

        if ((typeof str === 'object') || str instanceof Array) {
            try {
                //Should we use this?
                if (str.tagName || str._yuid || str._query) {
                    str = str.toString();
                } else {
                    str = sys.inspect(str);
                }
            } catch (e) {
                //Fail catcher
            }
        }

        var lvl = '37;40', mLvl = ((str) ? '' : 31);
        t = t+''; //Force to a string..
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
        if (typeof str === 'string') {
            if (str && str.indexOf("\n") !== -1) {
                str = "\n" + str;
            }
        }

        // output log messages to stderr
        sys.error(this.consoleColor(t.toLowerCase() + ':', lvl) + m + ' ' + this.consoleColor(str, mLvl));
    }
};

