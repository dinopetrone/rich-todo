define(function (require, exports, module) {

var rich = require('rich');
var ListCellView = require('./list-cell').ListCellView;
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var constraints = require('rich/autolayout/constraints');

var ListCollectionView =  rich.CollectionView.extend({
    childView : ListCellView,

    sizeForViewAtIndex: function(index){
        return [null, 60];
    },

});

exports.ListCollectionView = ListCollectionView;

});
