define(function(require, exports, module) {

var PhysicsEngine = require('famous/physics/PhysicsEngine');
var Particle = require('famous/physics/bodies/Particle');
var Spring = require('famous/physics/forces/Spring');
var Drag = require('famous/physics/forces/Drag');
var TouchSync = require('famous/inputs/TouchSync');
var ScrollSync = require('famous/inputs/ScrollSync');
var Engine = require('famous/core/Engine');
var MouseSync = require('famous/inputs/MouseSync');
var events = require('../../events');
var SimpleDriver = require('./simple').SimpleDriver;
var GenericSync = require('famous/inputs/GenericSync');

var BounceDriver = SimpleDriver.extend({
    _hasSpring: false,
    mobileStrength:0.003,
    strength: 0.005,
    initialize: function(scrollView) {
        this.scrollView = scrollView;
        this._spring = new Spring({
            period: 300,
            dampingRatio: 1
        });


        this._friction = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
        });

        this._drag = new Drag({
            forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
        });

        this._physicsEngine = new PhysicsEngine();
        this._physicsEngine.addBody(this.scrollView._particle);
    },

    shouldLimitPastBounds: function(){
        return false;
    },

    updateParticle: function(isPastLimits, anchorPoint, velocity) {
        var springOptions = {
            anchor: anchorPoint
        };

        if(this._throwMod){
            this._throwMod.callback();
        }

        if (isPastLimits) {
            this._spring.setOptions(springOptions);

            if (this._hasSpring) {
                // update spring
            } else {
                // add a spring
                this.scrollView.unbindParticle();
                this.scrollView._particle.setVelocity(0);
                this._physicsEngine.attach([this._spring], this.scrollView._particle);
                this._hasSpring = true;
                this.scrollView._scrollableView.setNeedsDisplay(true);
                this.scrollView._scrollableView.on(events.RENDER, this.scrollView.triggerScrollUpdate);
                this.scrollView._positionX.set(anchorPoint[0]);
                this.scrollView._positionY.set(anchorPoint[1]);
            }

        } else {
            if (this._hasSpring) {
                this._physicsEngine.detachAll();
                this.scrollView.bindParticle();
                this.scrollView._particle.setVelocity(0);
                this._hasSpring = false;
                this.scrollView._scrollableView.setNeedsDisplay(false);
                this.scrollView._scrollableView.off(events.RENDER, this.scrollView.triggerScrollUpdate);
            }
        }
    },

    updateComplete: function(velocity){
        var type = this.scrollView._scrollType;
        // remove all previous physics
        this._physicsEngine.detachAll();

        if(this._throwMod){
            this._throwMod.callback();
        }

        // we only want to add velocity if you're touch or click
        if(type == 'wheel')return;






        var strength = type == 'touchend' ? this.mobileStrength : this.strength;

        this._friction.setOptions({
            strength: strength
        });

        this._drag.setOptions({
            strength: strength
        });


        this.scrollView.unbindParticle();
        this._throwMod = this._prepareThrowModification();

        this._throwMod.deferred.then(function(){
            this.scrollView.bindParticle();
        }.bind(this));
        // TODO, make this work horizontally
        velocity[0] = 0;
        // velocity[1] = -velocity[1];
        this._state = 'drag'
        this._physicsEngine.attach([this._drag, this._friction], this.scrollView._particle);
        this.scrollView._particle.setVelocity(velocity);

    },

    _updateScrollPosition: function(){
        var pos = this.scrollView._particle.getPosition();
        this.scrollView._positionX.set(pos[0]);
        this.scrollView._positionY.set(pos[1]);
    },

    _prepareThrowModification: function() {
        var deferred = $.Deferred();

        var tick = function() {
            this.scrollView._scrollableView.invalidateView();
            this._updateScrollPosition();
            this.scrollView.invalidateView();
            var v = this.scrollView._particle.getVelocity();
            if(Math.abs(v[0]) < 0.001 && Math.abs(v[1]) < 0.001){
                callback();
            }
        }.bind(this);

        var callback = function() {
            Engine.removeListener('postrender', tick);
            deferred.resolve(this);
        }.bind(this);

        Engine.on('postrender', tick);

        return {
            deferred: deferred.promise(),
            callback: callback
        };
    },
});

exports.BounceDriver = BounceDriver;

});
