#!/usr/bin/env node
var Y = require('./sync-module');

Y.YQL('select * from github.user.info where (id = "davglass")', function(r) {
    //Do something here.
    Y.log(r.query, 'debug', 'yql');
});
