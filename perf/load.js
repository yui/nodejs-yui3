#!/usr/bin/env node

var util = require('util'),
    assert = require('assert'),
    i, start, end, times, startTime, endTime, t,
    max = 500;

console.log('Starting JS Load test with', max, 'requires');

var print = function(i) {
    var per = Math.round(Math.max((i / max) * 100)),
        bar = '', o;
    for (o = 0; o < 50; o++) {
        if ((o*2) <= per) {
            bar += '#';
        }
    }
    util.print('\r(' + i + ') ' + per + '% ' + bar);
}

startTime = (new Date()).getTime();
times = [];

for (var i = 0; i <= max; i++) {
    start = (new Date()).getTime();
    var YUI = require('yui3').YUI;
    var Y = YUI({debug: false}).useSync('yql');
    //assert.ok(Y.YQL);
    end = (new Date()).getTime();
    times.push((end - start));
    print(i);
}

endTime = (new Date()).getTime();
t = 0;

times.forEach(function(v) {
    t += v;
});

util.print('\r\n');
console.log('Test time: ', ((endTime - startTime) / 1000), 'sec');
console.log('Average Time: ', ((t / max) / 1000), 'sec');

