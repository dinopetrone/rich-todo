define(function (require, exports, module) {

var _ = require('underscore');
var $ = require('jquery');
var marionette = require('marionette');
var backbone = require('backbone');
var RenderNode = require('famous/core/RenderNode');
var ContainerSurface = require('famous/surfaces/ContainerSurface');
var Surface = require('famous/core/Surface');
var Modifier = require('famous/core/Modifier');
var Transform = require('famous/core/Transform');
var Entity = require('famous/core/Entity');
var Context = require('famous/core/Context');
var Engine = require('famous/core/Engine');
var events = require('./events');


var FamousView = marionette.View.extend({

    //size: null,
    nestedSubviews: false,
    shouldInitializeRenderable: false,
    modifier: null,
    zIndex: 1,
    superview: null,
    subviews: null,
    root: null,
    context: null,
    _spec: null,
    _needsDisplay: false,

    // we need to own initialize, this includes marionette.View()
    // AND backbone.View()
    constructor: function(options){
        options || (options = {});

        this.children = this.subviews = new backbone.ChildViewContainer();

        /* >>> BEGIN marionette.View() override */
         _.bindAll(this, 'render');

        // this exposes view options to the view initializer
        // this is a backfill since backbone removed the assignment
        // of this.options
        // at some point however this may be removed
        this.options = _.extend({}, _.result(this, 'options'), _.isFunction(options) ? options.call(this) : options);
        // parses out the @ui DSL for events
        this.events = this.normalizeUIKeys(_.result(this, 'events'));

        if (_.isObject(this.behaviors)) {
          new marionette.Behaviors(this);
        }

        // we explicitely defer the full backbone.View initialization
        // till later... we only need parts of it now.

        /* >>> BEGIN backbone.View() override */

        // we are literally taking everything from Backbone.View's constructor
        // except _ensureElement and delegateEvents
        // the famous context may not be available on this view yet,
        // in which case we cannot cerate the famous element ($el)
        // and we can't delegateEvents if we have no $el.

        this.cid = _.uniqueId('view');

        // duplicating this from backbone, don't readily see another way to grab it. =(
        // we only add 'context' for a convenience

        var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        var richOptions = ['context', 'modifier', 'nestedSubviews'];
        var propertyOptions = ['size'];
        var styleOptions = ['zIndex'];

        // conform to famous surface property structure,
        // the naming here is unfortunate for now.
        this.properties = {properties: {}};

        _.extend(this, _.pick(options, viewOptions.concat(styleOptions, richOptions)));
        _.extend(this.properties, _.pick(options, propertyOptions));

        this.properties.size = this.properties.size || this.size;
        this.properties.properties.zIndex = this.zIndex;

        this.initialize.apply(this, arguments);

        /* <<< END backbone.View() */
        marionette.MonitorDOMRefresh(this);
        this.listenTo(this, 'show', this.onShowCalled);
        /* <<< END marionette.View() override */
    },

    _prepareModification: function(duration, requireModifier){
        if(requireModifier !== false) requireModifier = true;

        var deferred = $.Deferred();

        if(!this.modifier && requireModifier){
            throw new Error('Please set a modifier on the view');
        }

        var self = this;

        var tick = function(){
            self._render();
        };

        var callback = function(){
            Engine.removeListener('postrender', tick);
            deferred.resolve(this);
        }.bind(this);

        if(!duration){
            this._render();
        }else{
            Engine.on('postrender', tick);
        }

        return {deferred: deferred.promise(), callback: callback};
    },

    setTransform: function(transform, transition, index){
        index || (index = 0);

        var target;
        var duration = transition && transition.duration ? transition.duration : null;
        var obj = this._prepareModification(duration);

        if(_.isArray(this._modifier)){
            target = this._modifier[index];
        } else {
            target = this._modifier;
        }

        target.setTransform(transform, transition, obj.callback);

        return obj.deferred;
    },

    getFamousId: function(){
        if(this.renderable){
            return this.renderable.id;
        }

        return null;
    },

    render: function(){
        if(this.root === null || this.needsDisplay()){
            this._render();
        }
        return this._spec;
    },

    invalidate: function(){
        this._render();
        this.triggerRichInvalidate();
    },

    _render: function(){
        var spec;
        this.root = this.createRenderNode();

        spec = this.root.render();
        this._spec = spec;
        this.triggerRichRender();
    },

    triggerRichRender: function(){
        this.trigger(events.RENDER, this);
    },

    triggerRichInvalidate: function(){
        this.trigger(events.INVALIDATE, this);
    },

    needsDisplay: function(){
        return this._needsDisplay;
    },

    setNeedsDisplay: function(value){
        this._needsDisplay = value;
    },

    resetNestedNode: function(container){
        var resetNode = new RenderNode();
        var currentNode = container.context._node;
        resetNode._prevResults = currentNode._prevResults || {};
        resetNode._resultCache = resetNode._prevResults;
        container.context._node = resetNode;
    },

    createNestedNode: function(context){
        var container = new ContainerSurface(this.properties);

        if(!this.renderable){
            this._ensureElement(container, context);
        }

        if (this.className){
            container.addClass(_.result(this, 'className'));
        }

        return container;
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

        if(this.nestedSubviews){
            if(!this.container){
                this.container = this.createNestedNode(this.context);
            }

            this.resetNestedNode(this.container);

            relative.add(this.container);
            context = this.container.context;
            relative = this.container;
        }

        if(!this.renderable && _.result(this, 'shouldInitializeRenderable')){
            this.renderable = this.initializeRenderable();
        }

        if(this.renderable){
            relative.add(this.renderable);
        }

        this.children.each(function(view){
            view.context = context;
            view.superview = this;
            relative.add(view);
        }, this);

        return root;
    },

    addSubview: function(view, zIndex){

        function setZIndex(value){
            view.zIndex = value;
            view.properties.properties.zIndex = value;
        }

        if(!zIndex && view.zIndex <= this.zIndex){
            setZIndex(this.zIndex + 1);
        } else if(zIndex){
            setZIndex(zIndex);
        }

        this.listenTo(view, events.INVALIDATE, this.subviewDidChange);
        this.children.add(view);

        if(this.root){
            this.invalidate();
        }
    },

    subviewDidChange: function(view){
        // consider an alternate way to index this information?
        // so we don't have to step through the array each time?
        // might not be worth it, might be worth it.
        // we'd need to keep that index up to date, so it
        // might be more housekeeping than is worth it.

        if(this._spec === null) this._spec = [];

        var spec = view._spec;

        var arr = this._spec.target || this._spec;
        var famousId = view.getFamousId();

        // this is a view without a renderable
        if(famousId === null && _.isArray(this._spec)){

            if(_.isNull(spec) || _.isArray(spec)){
                this._spec = spec;
            } else {
                this._spec.push(spec);
            }
            this.triggerRichInvalidate();
            return;
        }

        for(var i=1; i < arr.length; i++){
            var obj = arr[i];
            var id;

            if(_.isNumber(obj)){
                id = obj;
            } else if (_.isNumber(obj.target)){
                id = obj.target;
            } else if(_.isArray(obj.target)) {
                id = obj.target[0];
            } else {
                console.log(obj);
                throw new Error('An unexpected error occured '+
                                'when updating render spec.');
            }

            if(id == famousId){
                arr[i] = spec;
                break;
            }
        }

        this.triggerRichInvalidate();
    },

    removeSubview: function(view){
        this.children.remove(view);
        this.stopListening(view, events.INVALIDATE, this.subviewDidChange);

        if(this.root){
            this.invalidate();
        }
    },

    removeFromSuperview: function(){
        this.superview.removeSubview(this);
    },

    setSize: function(value){
        this.properties.size = value;

        if(this.root){
            this.invalidate();
        }
    },

    getSize: function(){
        if(!this.properties.size){
            this.properties.size = _.result(this.properties, 'size') || [undefined, undefined];
        }

        return this.properties.size;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function(renderable, context) {
      if (!this.el) {
        // this wrongly assumes it will always have a
        // .commit function. Will need to poribably rethink this.

        if (this.className){
            renderable.addClass(_.result(this, 'className'));
        }

        if(!renderable._currTarget){
            renderable.setup(context._allocator);
        }

        var $el = $(renderable._currTarget);

        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');

        // var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        $el.attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }

      // this is a new event for rich.
      // a FamousView with nestedSubviews will have
      // an $el, but a FamousView that does not have
      // nestedSubviews enabled will not have an $el.
      // onElement is what you want if you need to know about
      // weather or not an element is available.
      this.triggerMethod('element', this);
    },

    // override Backbone.View.remove()
    remove: function(){
        // Famo.us recycles elements, removing the $el
        // here has a high chance of causing problems.
        // otherwise this is basically the same as
        // Backbone.View.remove()

        // this.$el.remove();
        this.children = null;
        this.root = null;
        this.undelegateEvents();
        this.stopListening();
        return this;
    },

});
exports.FamousView = FamousView;

});
