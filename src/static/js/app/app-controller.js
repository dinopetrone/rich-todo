define(function(require, exports, module) {

var $ = require('jquery');
var backbone = require('backbone');
var marionette = require('marionette');
var app = require('app/app');
var TodoLayout = require('app/todo/views/todo-layout').TodoLayout;
var constraintsWithVFL = require('rich/autolayout/constraints').constraintsWithVFL;

var AppController = marionette.Controller.extend({

    initialize: function(options){
        this.app = app;

        this.todo = new TodoLayout();

        this.app.window.fillWithSubview(this.todo);
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
