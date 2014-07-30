define(function (require, exports, module) {

var rich = require('rich');
var template = require('hbs!../templates/footer');

var FooterView = rich.ItemView.extend({
    template : template,
    ui : {

    },
    events : {

    },
    size: [100, 20],
    initialize : function(){

    }
});

exports.FooterView = FooterView;

});
