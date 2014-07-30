define(function (require, exports, module) {

var marionette = require('marionette');
var Engine = require('famous/core/Engine');
var RenderNode = require('famous/core/RenderNode');
var FamousLayoutView = require('./layoutviews').FamousLayoutView;
var FamousView = require('./view').FamousView;
var utils = require('./utils');
var events = require('./events');

var regionClassWithConfig = function(config){
    var modifier = utils.modifierWithAlign(config, modifier);

    utils.modifierWithOpacity(config, modifier);
    utils.modifierWithOrigin(config, modifier);
    utils.modifierWithSize(config, modifier);
    utils.modifierWithTransform(config, modifier);

    return FamousRegion.extend({modifier: modifier});
};

var FamousRegion = marionette.Region.extend({
    root: null,

    constructor: function(options){

        this.options = options || {};

        if(options.context){
            this.context = options.context;
        }

        if(options.modifier){
            this.modifier = options.modifier;
        }

        this.el = Marionette.getOption(this, 'el');

        if(typeof this.el == 'string'){
            this.el = $(this.el);
        }
        if(!this.context && !this.el){
            var message = 'An \'el\' or \'context\' must be specified for a region.';
            var error = new Error(message);
            error.name = 'NoElError';
            throw error;
        }

        if (this.el && !this.context){
            this.context = Engine.createContext(this.el[0]);
        }

        if (this.initialize){
            var args = Array.prototype.slice.apply(arguments);
            this.initialize.apply(this, args);
        }

        var target = this.superview || this.context;

        this.view = new FamousView();
        this.view.context = this.context;
        this.view.superview = this;

        if(target == this.context){
            target.add(this);
        }

        this.listenTo(this.view, events.INVALIDATE, this._viewDidChange);

    },

    render: function(){
        if(!this.root){
            this._render();
        }

        return this._spec;
    },

    _render: function(){
        var root = this.createRenderNode();
        this._spec = root.render();
        this.root = root;
        return root;
    },

    applyModifiers: function(modifiers, node){
        if(_.isArray(modifiers)){

            _.each(modifiers, function(modifier){
                node = node.add(modifier);
            });

        } else {
            node = node.add(modifiers);
        }

        return node;
    },

    createRenderNode: function(){

        var root = new RenderNode();
        var relative = root;
        var context = this.context;

        if(this.modifier){
            var modifiers = _.result(this, 'modifier');
            relative = this.applyModifiers(modifiers, root);

            this._modifier = modifiers;
        }

        relative.add(this.view);
        return root;
    },

    _viewDidChange: function(){
        this.view.root = null;
        this.root = null;
        this.trigger(events.INVALIDATE, this);
    },

    getFamousId: function(){
        return this.view.getFamousId();
    },

    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `close` method on your view, just after showing
    // or just before closing the view, respectively.
    // The `preventClose` option can be used to prevent a view from being destroyed on show.
    show: function(view, options){
        var showOptions = options || {};
        var isDifferentView = view !== this.currentView;
        var preventDestroy =  !!showOptions.preventDestroy;
        var forceShow = !!showOptions.forceShow;

        // we are only changing the view if there is a view to change to begin with
        var isChangingView = !!this.currentView;

        // only destroy the view if we don't want to preventDestroy and the view is different
        var _shouldDestroyView = !preventDestroy && isDifferentView;

        if (_shouldDestroyView) {
            this.empty();
        }

        var _shouldShowView = isDifferentView || forceShow;

        if (_shouldShowView) {

            if (isChangingView) {
                this.triggerMethod('before:swap', view);
            }

            this.triggerMethod('before:show', view);
            this.triggerMethod.call(view, 'before:show');

            this.currentView = view;

            if (isChangingView) {
                this.triggerMethod('swap', view);
            }

            if (isDifferentView) {
                this.open(view);
            }

            utils.postrenderOnce(function(){
                this.triggerMethod('show', view);

                if (_.isFunction(view.triggerMethod)) {
                    view.triggerMethod('show');
                } else {
                    this.triggerMethod.call(view, 'show');
                }
            }.bind(this));

        }
        return this;
    },

    open: function(view){

        // layout
        if(view instanceof FamousLayoutView){
            // if this is a layout, then we need to assign it what it's
            // region type is first, then call it's _initializeRegions method
            // in a marionette layout this is called in the constructor
            // we defer to display time in a FamousLayoutView so we
            // get the proper display tree

            view.regionClass = FamousRegion.extend({
                context: this.context,
                superview: this.view
            });

            view.__init__(this.context);

        }

        // view.context = this.context;
        this.view.addSubview(view);
    },

    // this is the default, i'll need to likely add stuff
    empty: function() {
      var view = this.currentView;
      if (!view || view.isDestroyed) { return; }

      this.triggerMethod('before:empty', view);

      this.view.removeSubview(this.currentView);

      // call 'destroy' or 'remove', depending on which is found
      if (view.destroy) { view.destroy(); }
      else if (view.remove) { view.remove(); }

      this.triggerMethod('empty', view);

      delete this.currentView;
    }
});

exports.FamousRegion = FamousRegion;
exports.regionClassWithConfig = regionClassWithConfig;

});
