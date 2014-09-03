define(function(require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var HeaderView = require('./header').HeaderView;
var ListCollectionView = require('./list').ListCollectionView;
var FooterView = require('./footer').FooterView;
var Tasks = require('../collections/tasks').Tasks;
var scroll = require('rich/scrollview/scrollview');
var BounceDriver = require('rich/scrollview/scroll-drivers/bounce').BounceDriver;
var LongView = require('app/shared/views/long-view').LongView;
var constraints = require('app/todo/constraints/todo-layout');

var TodoLayout = rich.View.extend({

    constraints: function() {
        var c;
        if (window.outerWidth > 1028) {
            c = constraints.large;
        } else {
            c = constraints.medium;
        }
        return c;
    },

    initialize: function() {
        this.masterCollection = new Tasks();
        this.filteredCollection = new Tasks();

        _.each(_.range(10), function(i) {
            this.masterCollection.add({
                title: 'task ' + (i + 1),
                isActive: Math.random() > 0.5
            });
        }, this);


        this.filteredCollection.reset(this.masterCollection.models);
        this.name = 'todolayout';

        this.initializeViews();
    },

    shouldInitializeRenderable: function() {
        return false;
    },

    initializeViews: function() {
        var options = {
            collection: this.filteredCollection,
            masterCollection: this.masterCollection
        };

        // // list view creation inside a scrollview
        var listview = this.listView = new ListCollectionView(options);
        options.listView = listview;

        var scrollview = this.scrollview = new scroll.ScrollView({
            contentSize: function() {
                if (listview.children.length === 0) {
                    return [0, 0];
                }

                var size = listview.children.findByIndex(0).getSize();
                var height = this.filteredCollection.length * (size[1] + this.listView.spacing);

                return [0, height];
            }.bind(this),

            direction: scroll.DIRECTION_Y,
            nestedSubviews: true,
            scrollDriver: BounceDriver
        });


        this.listenTo(listview, 'change', scrollview.update.bind(scrollview));


        scrollview.show(this.listView);

        this.headerView = new HeaderView(options);
        this.footerView = new FooterView(options);


        this.addSubview(this.headerView);
        this.addSubview(this.scrollview);
        this.addSubview(this.footerView);
    },

    showActive: function() {
        this.filteredCollection.reset(this.masterCollection.activeTasks());
    },

    showCompleted: function() {
        this.filteredCollection.reset(this.masterCollection.completedTasks());
    },

    showAll: function() {
        this.filteredCollection.reset(this.masterCollection.models);
    },
});

exports.TodoLayout = TodoLayout;

});
