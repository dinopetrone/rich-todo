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
                    origin: [0.5, 0]
                });
            }
        }),
        list: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 0],
                    transform: Transform.translate(0, 50, 0)
                });
            }
        }),
        footer: rich.Region.extend({
            modifier: function(){
                return new Modifier({
                    origin: [0.5, 1]
                });
            }
        })
    },

    shouldInitializeRenderable: function(){
        return false;
    },

    onShow : function(){
        var collection = new Tasks();
        _.each(_.range(20), function(i){
            // collection.add({title:'hi'+(i+1)});
        });


        var options = {
            collection: collection
        };

        // list view creation inside a scrollview
        var listView = new ListCollectionView(options);
        var scrollview = new scroll.ScrollView({
            contentSize: function(){
                return listView.getSize();
            },
            size: [400, 400],
            direction: scroll.DIRECTION_Y
        });
        scrollview.addSubview(listView);

        // show views
        this.header.show(new HeaderView(options));
        this.list.show(scrollview);
        this.footer.show(new FooterView(options));
    }
});

exports.TodoLayout = TodoLayout;

});
