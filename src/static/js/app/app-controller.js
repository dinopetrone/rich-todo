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
        this.todo.name = 'todo';


        this.app.window.addSubview(this.todo);

        var c1 = constraintsWithVFL('|[todo]|', {todo: this.todo});
        var c2 = constraintsWithVFL('V:|[todo]|', {todo: this.todo});
        this.app.window.addConstraints([].concat(c1, c2));
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
