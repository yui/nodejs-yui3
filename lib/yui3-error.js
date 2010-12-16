    // Extract meaning from stack traces
var STACK_FRAME_RE = /.* \(?(.+:\d+:\d+)\)?$/;


//Helper methods
//Get the Error Message from the stack
exports.getMessage = function(e) {
    try {
        return e.message || e.stack.split('\n')[0].trim();
    } catch (e) {
        return 'YUI: failed to get error message';
    }
};

// Get the filename for a given exception
exports.getFilename = function(e) {
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
exports.getLine = function(e) {
    try {
        var m = e.stack.split('\n')[1].match(STACK_FRAME_RE);
        var parts = m[1].split(':');
        return parseInt(parts[parts.length - 2]);
    } catch (e) {
        return -1;
    }
};

