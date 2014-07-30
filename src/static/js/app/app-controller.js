define(function(require, exports, module) {

var $ = require('jquery');
var backbone = require('backbone');
var marionette = require('marionette');
var app = require('app/app');
var TodoLayout = require('app/todo/views/todo-layout').TodoLayout;




var AppController = marionette.Controller.extend({

    initialize: function(options){
        this.app = app;
        this.app.todo.show(new TodoLayout());
    },

    index: function(){

    },
});

exports.AppController = AppController;
});
