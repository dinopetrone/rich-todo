define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/header');


var HeaderView = rich.ItemView.extend({
    template : template,
    size: [200, 50],
    ui: {
        input: '#new-task'
    },
    events: {
        'keypress #new-task': 'onInputConfirm'
    },
    initialize : function(options){
        this.masterCollection = options.collection
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
        this.masterCollection.add({
            title: name
        })
    }
});

exports.HeaderView = HeaderView;

});
