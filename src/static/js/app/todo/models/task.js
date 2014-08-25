define(function( require, exports, module ){

var backbone = require('backbone');
var Task = backbone.Model.extend({
    defaults: {
        title: null,
        isActive: true,
        date: null,
    },
    initialize: function() {
        this.set('date', Date.now());
    },
    toggleIsActive: function() {
        this.set('isActive', !this.get('isActive'));
    }
});

exports.Task = Task;

});
