define(function( require, exports, module ){

var backbone = require('backbone');
var Task = require('../models/task').Task;

var Tasks =  backbone.Collection.extend({
    model: Task
});

exports.Tasks = Tasks;

});
