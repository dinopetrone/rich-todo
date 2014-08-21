define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/list-cell');

var ListCellView = rich.ItemView.extend({
    className: 'list-cell',
    template : template,
    ui: {
        edit: '.edit-button',
        input: '.editor',
        remove: '.destroy-button',
        title: '.title',
        checkbox: '.checkbox'
    },
    // size:[800, 60],
    events: {
        'click @ui.remove': 'wantsRemove',
        'click @ui.edit': 'wantsEdit',
        'keypress @ui.input': 'wantsSubmit',
        'click @ui.checkbox': 'wantsSwitchState'
    },

    initialize: function(options) {
        this.masterCollection = options.masterCollection;
    },

    onRender: function(){
        this.ui.input.hide();
    },

    wantsEdit: function() {
        var editBoxHidden = this.ui.input.css('display') === 'none';
        if (editBoxHidden) {
            this.ui.input.show().focus();
        } else {
            this.ui.input.hide();
        }
    },

    wantsSubmit: function(event) {
        var taskString = this.ui.input.val().trim();
        if (event.which === 13 && taskString) {
            this.model.set('title', taskString);
            this.ui.title.html(taskString);
            this.ui.input.attr('placeholder', taskString);
            this.ui.input.val('');
            this.ui.input.hide();
        }
    },

    wantsSwitchState: function() {
        console.log(this.model.get('title'));
        this.model.toggleIsActive();
    },

    wantsRemove: function() {
        this.model.destroy();
    },
});

exports.ListCellView = ListCellView;

});
