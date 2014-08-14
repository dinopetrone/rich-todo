define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var HeaderView = require('./header').HeaderView;
var ListCollectionView = require('./list').ListCollectionView;
var FooterView = require('./footer').FooterView;
var Tasks = require('../collections/tasks').Tasks;
var scroll = require('rich/scrollview');

var TodoLayout = rich.View.extend({

    constraints: [
        {
            item: 'headerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'headerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'headerView',
            attribute: 'top',
            constant: 30,
            relatedBy: '==',
        },
    ],

    initialize: function(){
        this.masterCollection = new Tasks();
        this.filteredCollection = new Tasks();
        _.each(_.range(20), function(i){
            this.masterCollection.add({
                title:'hi'+(i+1),
                isActive: Math.random() > 0.5
            });
        }, this);

        this.filteredCollection.reset(this.masterCollection.models);
        this.initializeViews();
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    initializeViews : function(){
        var options = {
            collection: this.filteredCollection,
            masterCollection: this.masterCollection
        };

        // list view creation inside a scrollview
        var listview = this.listView = new ListCollectionView(options);
        var scrollview = new scroll.ScrollView({
            contentSize: function(){
                return listview.getSize();
            },
            direction: scroll.DIRECTION_Y
        });
        this.listenTo(this.filteredCollection, 'add remove reset', function(){
            scrollview.update();
        });
        scrollview.addSubview(this.listView);

        this.headerView = new HeaderView(options);
        this.addSubview(this.headerView);

        // show views
        // this.header.show();
        // this.list.show(scrollview);
        // this.footer.show(new FooterView(options));
    },

    showActive: function(){
        this.filteredCollection.reset(this.masterCollection.activeTasks());
    },

    showCompleted: function(){
        this.filteredCollection.reset(this.masterCollection.completedTasks());
    },

    showAll: function(){
        this.filteredCollection.reset(this.masterCollection.models);
    },
});

exports.TodoLayout = TodoLayout;

});
