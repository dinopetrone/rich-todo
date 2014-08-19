define(function (require, exports, module) {

var rich = require('rich');
var ListCellView = require('./list-cell').ListCellView;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var constraints = require('rich/autolayout/constraints');

var ListCollectionView =  rich.CollectionView.extend({
    childView : ListCellView,
    getSize: function(){
        var height = 0;
        this.children.each(function(child){
            height += 50;
        });
        return [400, height];
    },

    modifierForViewAtIndex: function(view, index){
        var offset = index * 50;
        return new Modifier({
            transform: Transform.translate(0, offset, 0)
        });
    },

});

exports.ListCollectionView = ListCollectionView;

});
