define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var HeaderView = require('./header').HeaderView;
var ListCollectionView = require('./list').ListCollectionView;
var FooterView = require('./footer').FooterView;
var Tasks = require('../collections/tasks').Tasks;
var scroll = require('rich/scrollview/scrollview');
var BounceDriver = require('rich/scrollview/scroll-drivers/bounce').BounceDriver;

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
            attribute: 'height',
            constant: 30,
            relatedBy: '==',
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

        // scrollview
        {
            item: 'scrollview',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'scrollview',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'scrollview',
            attribute: 'top',
            toItem: 'headerView',
            toAttribute: 'bottom',
            relatedBy: '==',
        },
        {
            item: 'scrollview',
            attribute: 'height',
            toItem: 'superview',
            toAttribute: 'height',
            relatedBy: '==',
            multiplier: 1,
            constant: -140
        },

        // footer
        {
            item: 'footerView',
            attribute: 'width',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.5
        },
        {
            item: 'footerView',
            attribute: 'left',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'right',
            relatedBy: '==',
            toItem: 'superview',
            toAttribute: 'width',
            multiplier: 0.25
        },
        {
            item: 'footerView',
            attribute: 'bottom',
            constant: 30,
            relatedBy: '==',
        },

        {
            item: 'footerView',
            attribute: 'height',
            constant: 30,
            relatedBy: '==',
        },

    ],

    initialize: function(){
        this.masterCollection = new Tasks();
        this.filteredCollection = new Tasks();
        _.each(_.range(100), function(i){
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

        // console.log(scroll.ScrollView)
        var scrollview = this.scrollview = new scroll.ScrollView({
            contentSize: function(){
                var size = listview.getSize();
                return [800, size[1]];
            },
            direction: scroll.DIRECTION_Y,
            nestedSubviews: true,
            scrollDriver: BounceDriver
        });

        // var scrollview = this.scrollview = new rich.View({
        //     nestedSubviews: true
        // });


        // this.listenTo(this.filteredCollection, 'add remove reset', function(){
        //     scrollview.update();
        // });

        scrollview.addSubview(this.listView);

        this.headerView = new HeaderView(options);
        this.footerView = new FooterView(options);


        this.addSubview(this.headerView);
        this.addSubview(this.scrollview);
        this.addSubview(this.footerView);
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
