define(function( require, exports, module ){

var backbone = require('backbone');
var Task = require('../models/task').Task;

var Tasks =  backbone.Collection.extend({
    model: Task,
    activeTasks: function() {
        return this.filter(function(task) {
            return task.get('isActive');
        });
    },
    completedTasks: function() {
        return this.filter(function(task) {
            return !task.get('isActive');
        });
    },
    numOfActiveTasks: function() {
        return this.activeTasks().length;
    },
    numOfCompletedTasks: function() {
        return this.completedTasks().length;
    },

    setSelected: function(val){
        this.each(function(item){
            item.set('isActive', !val);
        });
    },
});

exports.Tasks = Tasks;

});
