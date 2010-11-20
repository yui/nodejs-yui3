#!/usr/bin/env node
var Y = require('yui3').useSync('yql');

Y.YQL('select * from github.user.info where (id = "davglass")', function(r) {
    //Do something here.
    Y.log(r.query, 'debug', 'yql');
});
