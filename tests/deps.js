#!/usr/bin/env node

try {
    require('yui3-core@3.2.0');
} catch (e) {
    console.log('yui3-core@3.2.0 needs to be installed');
    process.exit(1);
}
try {
    require('yui3-core@3.3.0');
} catch (e) {
    console.log('yui3-core@3.3.0 needs to be installed');
    process.exit(1);
}
try {
    require('yui3-gallery@2010.09.22');
} catch (e) {
    console.log('yui3-gallery@2010.09.22 needs to be installed');
    process.exit(1);
}
try {
    require('yui3-2in3');
} catch (e) {
    console.log('yui3-2in3 needs to be installed');
    process.exit(1);
}
