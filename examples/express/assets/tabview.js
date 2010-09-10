YUI({ fetchCSS: false }).use('tabview', function(Y) {
    new Y.TabView({
        srcNode: '#demo .yui3-tabview-content'
    }).render();
});
