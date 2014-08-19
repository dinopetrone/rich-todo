define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');
    var utils = require('rich/utils');

    _.extend(marionette.Application.prototype, {

        addRichContexts: function(obj){
            _.each(obj, function(options, key){
                this[key] = utils.initializeRichContext(options);
            }, this);
        }
    });
});
