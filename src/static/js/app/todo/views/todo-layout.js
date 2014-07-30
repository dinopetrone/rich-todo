define(function (require, exports, module) {

var rich = require('rich');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var HeaderView = require('./header').HeaderView;
var ListCollectionView = require('./list').ListCollectionView;
var FooterView = require('./footer').FooterView;
var Tasks = require('../collections/tasks').Tasks;
var scroll = require('rich/scrollview');

var TodoLayout = rich.LayoutView.extend({
    regions: {
        header: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 0],
                    transform: Transform.translate(0, 20, 0)
                });
            }
        }),
        list: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 0],
                    transform: Transform.translate(0, 70, 0)
                });
            }
        }),
        footer: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 1],
                    transform: Transform.translate(0, -20, 0)
                });
            }
        })
    },

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

    },

    shouldInitializeRenderable: function(){
        return false;
    },

    onShow : function(){
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
            size: [400, 400],
            direction: scroll.DIRECTION_Y
        });
        this.listenTo(this.filteredCollection, 'add remove reset', function(){
            scrollview.update();
        });
        scrollview.addSubview(this.listView);

        // show views
        this.header.show(new HeaderView(options));
        this.list.show(scrollview);
        this.footer.show(new FooterView(options));
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
