define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/header');


var HeaderView = rich.ItemView.extend({
    template : template,
    ui: {
        input: '#new-todo'
    },
    events: {
        'keypress #new-todo': 'onInputConfirm'
    },
    initialize : function(options){
        this.masterCollection = options.masterCollection;
    },

    onRender: function(){
        this.ui.input.focus();
    },

    onInputConfirm: function(event) {
        // trim() trims whitespace (if any) in val()
        var taskString = this.ui.input.val().trim();

        // Check for enter key press & if string is defined.
        if (event.which === 13 && taskString) {
            event.preventDefault();
            this.createTask(taskString);
            this.ui.input.val('');
        }
    },

    createTask: function(name) {
        var model = this.masterCollection.add({
            title: name
        });
        this.collection.add(model);
    }
});

exports.HeaderView = HeaderView;

});
