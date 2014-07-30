define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/list-cell');

var ListCellView = rich.ItemView.extend({
    template : template,
    size: [400, 50],
    ui: {
        edit: '.edit',
        input: '.editor',
        remove: '.remove',
        title: '.title',
        checkbox: '.checkbox'
    },
    // Four possible events: remove, edit, accept edit,
    // & active/completed state switching.
    events: {
        'click @ui.remove': 'wantsRemove',
        'click @ui.edit': 'editClick',
        'keypress @ui.input': 'editAccept',
        'click @ui.checkbox': 'switchState'
    },
    initialize: function(options) {
        this.masterCollection = options.masterCollection;
        this.model = options.model;
        this.listenTo(this.model, 'change', this.render);
    },

    // On show, set all of the different completed or active states.
    onElement: function() {
        this.toggleClass();
    },

    onRender: function(){
        this.ui.input.hide();
    },

    editClick: function() {
        var editBoxHidden = this.ui.input.css('display') === 'none';
        if (editBoxHidden) {
            this.ui.input.show().focus();
        } else {
            this.ui.input.hide();
        }
    },

    // Almost exact same logic as TaskCreation's 'onInputConfirm'.
    editAccept: function(event) {
        var taskString = this.ui.input.val().trim();
        if (event.which === 13 && taskString) {
            this.model.set('title', taskString);
            this.ui.title.html(taskString);
            this.ui.input.attr('placeholder', taskString);
            this.ui.input.val('');
            this.ui.input.hide();
        }
    },

    switchState: function() {
        this.model.toggleIsActive();
        this.toggleClass();
    },

    toggleClass: function() {
        this.$el.removeClass('active completed done');
        var isActive = this.model.get('isActive');
        if (isActive) {
            this.$el.addClass('active');
        } else {
            this.$el.addClass('completed done');
        }
    },

    wantsRemove: function() {
        this.destroyModel();
    },

    destroyModel: function() {
        this.model.destroy();
    }
});

exports.ListCellView = ListCellView;

});
