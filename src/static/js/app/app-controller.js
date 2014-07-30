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
        this.app.todo.show(this.todo);
    },

    index: function(){

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
