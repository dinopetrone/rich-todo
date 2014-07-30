define(function( require, exports, module ){

var backbone = require('backbone');
var Task = backbone.Model.extend({
    defaults: {
        title: null,
        isActive: true,
        date: null,
    }
});

exports.Task = Task;

});
