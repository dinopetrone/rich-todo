define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/footer');
var backbone = require('backbone');

var FooterView = rich.ItemView.extend({
    template : template,
    ui: {
        numberActive: '#active-count strong',
        toggleAll: '#toggle-all',
        checkDone: '#check-done',
        clearCompleted: '#clear-completed'
    },
    events: {
        'click #clear-completed': 'wantsClearCompleted',
        'click .filter': 'wantsChangeFilter',
        'click #toggle-all': 'wantsToggleAll'
    },
    size: [400, 50],
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
        backbone.history.navigate(status);
    },

    wantsToggleAll: function(event) {
        this.toggleAll();
    },

    toggleAll: function() {
        var toggled = this.ui.checkDone.hasClass('done');
        this.masterCollection.forEach(function(model) {
            model.set('isActive', toggled).save();
        });
        if (toggled) {
            this.ui.checkDone.removeClass('done');
        } else {
            this.ui.checkDone.addClass('done');
        }

    },
});

exports.FooterView = FooterView;

});
