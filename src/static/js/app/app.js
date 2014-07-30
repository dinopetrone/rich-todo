define(function(require, exports, module) {
    var marionette = require('marionette');
    var app = new marionette.Application();
    var rich = require('rich');

    app.addRegions({
        todo: rich.Region.extend({
            el:'body'
        }),
    });

    app.addInitializer(function() {
        Backbone.history.start({
            pushState: false
        });
    });


    return app;
});
