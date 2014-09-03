define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/list-cell');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');

var ListCellView = rich.ItemView.extend({
    autolayoutTransition: {
        duration: 200
    },
    className: 'list-cell',
    template : template,
    ui: {
        edit: '.edit-button',
        input: '.editor',
        remove: '.destroy-button',
        title: '.title',
        checkbox: '.checkbox'
    },
    events: {
        'click @ui.remove': 'wantsRemove',
        'click @ui.edit': 'wantsEdit',
        'dblclick @ui.title': 'wantsEdit',
        'keypress @ui.input': 'wantsSubmit',
        'click @ui.checkbox': 'wantsSwitchState'
    },

    initialize: function(options) {
        this.modifier = new Modifier();
        this.masterCollection = options.masterCollection;
        this.listenTo(this.model, 'change:isActive', this.onActiveChange);
    },

    onRender: function(){
        this.ui.input.hide();
    },

    onActiveChange: function(){
        this.ui.checkbox.prop("checked", !this.model.get('isActive'));
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
        this.model.toggleIsActive();
    },

    wantsRemove: function() {
        this.setTransform(Transform.translate(1000, 0, 0),{
            duration:200
        }).then(function(){
            this.model.destroy();
        }.bind(this));
    },
});

exports.ListCellView = ListCellView;

});
