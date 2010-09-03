#!/usr/bin/env node
var sys = require('sys'),
    fs = require('fs');

var YUI = require("yui3").YUI;

// TODO: This should pass, but currently doesn't.
// This will work for YUI core, but any submodules are in different files
// This will work better once the 3.1.0 version of YUI is available
// And you can combo handle all the submodules into one request.


//require("assert").equal( global.YUI, undefined, "global yui created");


//Now use non-DOM related YUI utilities
YUI({
    filter: 'debug',
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
}).use('nodejs-dom', function(Y) {
    document = Y.Browser.document;
    navigator = Y.Browser.navigator;
    window = Y.Browser.window;

    Y.log('JSDom testing..');
    Y.use('yui2-datatable', 'yui2-datasource', function(Y) {
        var YAHOO = Y.YUI2;

        var el = document.createElement('div');
        el.id = 'basic';
        document.body.appendChild(el);
        
        YAHOO.example.Data = {
            bookorders: [
                {id:"po-0167", date:new Date(1980, 2, 24), quantity:1, amount:4, title:"A Book About Nothing"},
                {id:"po-0783", date:new Date("January 3, 1983"), quantity:null, amount:12.12345, title:"The Meaning of Life"},
                {id:"po-0297", date:new Date(1978, 11, 12), quantity:12, amount:1.25, title:"This Book Was Meant to Be Read Aloud"},
                {id:"po-1482", date:new Date("March 11, 1985"), quantity:6, amount:3.5, title:"Read Me Twice"}
            ]
        };
        
        
        var myColumnDefs = [
            {key:"id", sortable:true, resizeable:true},
            {key:"date", formatter:YAHOO.widget.DataTable.formatDate, sortable:true, sortOptions:{defaultDir:YAHOO.widget.DataTable.CLASS_DESC},resizeable:true},
            {key:"quantity", formatter:YAHOO.widget.DataTable.formatNumber, sortable:true, resizeable:true},
            {key:"amount", formatter:YAHOO.widget.DataTable.formatCurrency, sortable:true, resizeable:true},
            {key:"title", sortable:true, resizeable:true}
        ];

        Y.log('Creating DataSource..');
        var myDataSource = new YAHOO.util.DataSource(YAHOO.example.Data.bookorders);
        myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
        myDataSource.responseSchema = {
            fields: ["id","date","quantity","amount","title"]
        };
        Y.log('Creating DataTable..');

        var myDataTable = new YAHOO.widget.DataTable("basic",
                myColumnDefs, myDataSource, {caption:"DataTable Caption"});

        myDataTable.on('renderEvent', function() {
            Y.log('Done..');
            Y.log(document.body.outerHTML, 'HTML');
        });
    });
});
