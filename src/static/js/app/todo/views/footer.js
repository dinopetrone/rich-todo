define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/footer');
var backbone = require('backbone');

var FooterView = rich.ItemView.extend({
    template : template,
    ui: {
        numberActive: '#active-count strong',
        checkDone: '#check-done',
        clearCompleted: '#clear-completed'
    },
    events: {
        'click #clear-completed': 'wantsClearCompleted',
        'click .filter': 'wantsChangeFilter',
    },

    initialize: function(options){
        this.listenTo(options.collection, 'add remove', this.updateCount);
    },

    updateCount: function(){
        this.ui.numberActive.html(this.collection.length);
    },

    wantsClearCompleted: function() {
        this.clearCompleted();
    },

    clearCompleted: function() {
        this.collection.completedTasks().forEach(function(model) {
            model.destroy();
        });
    },

    wantsChangeFilter: function(event) {
        var $target = $(event.currentTarget);
        var status = $target.data('filter');

        this.changeFilter(status);
    },

    changeFilter: function(status) {
        backbone.history.navigate(status, {
            trigger:true
        });
    },

});

exports.FooterView = FooterView;

});
