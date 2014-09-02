define(function(require, exports, module) {

var $ = require('jquery');
var backbone = require('backbone');
var marionette = require('marionette');
var app = require('app/app');
var TodoLayout = require('app/todo/views/todo-layout').TodoLayout;

var AppController = marionette.Controller.extend({

    initialize: function(options){
        this.app = app;
        this.todo = new TodoLayout();


        // @adam we need to discuss this... obv i'm doing something wrong
        // because this is painful
        this.app.todo.constraints = function(){
            return [
                {
                    item: this.todo,
                    attribute: 'width',
                    toItem: this.app.todo,
                    toAttribute: 'width',
                    relatedBy: '=='
                },
                {
                    item: this.todo,
                    attribute: 'height',
                    toItem: this.app.todo,
                    toAttribute: 'height',
                    relatedBy: '=='
                }
            ];
        }.bind(this);
        this.app.todo.addSubview(this.todo);
        this.app.todo.invalidateLayout();
    },

    index: function(){
        this.todo.showAll();
    },

    showActive: function(){
        this.todo.showActive();
    },

    showCompleted: function(){
        this.todo.showCompleted();
    },
});

exports.AppController = AppController;
});
