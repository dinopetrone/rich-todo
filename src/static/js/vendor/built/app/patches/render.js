define(function (require, exports, module) {
    var _ = require('underscore');
    var marionette = require('marionette');

    _.extend(marionette.ItemView.prototype, {
        render: function(){
            this.isClosed = false;
            this.triggerMethod("before:render", this);
            this.triggerMethod("item:before:render", this);

            var data = this.serializeData();
            data = this.mixinTemplateHelpers(data);

            var template = this.getTemplate();

            if(template){
                var html = Marionette.Renderer.render(template, data);
                this.$el.html(html);
            }

            this.bindUIElements();

            this.triggerMethod("render", this);
            this.triggerMethod("item:rendered", this);

            return this;
        },
    });

    _.extend(marionette.CompositeView.prototype, {
        render: function(){
            this.isRendered = true;
            this.isClosed = false;
            this.resetItemViewContainer();

            this.triggerBeforeRender();
            var html = this.renderModel();

            if(html){
                this.$el.html(html);
            }

            // the ui bindings is done here and not at the end of render since they
            // will not be available until after the model is rendered, but should be
            // available before the collection is rendered.
            this.bindUIElements();
            this.triggerMethod("composite:model:rendered");

            this._renderChildren();

            this.triggerMethod("composite:rendered");
            this.triggerRendered();
            return this;
        },

        renderModel: function(){
            var data = {};
            data = this.serializeData();
            data = this.mixinTemplateHelpers(data);

            var template = this.getTemplate();
            if(template){
                return Marionette.Renderer.render(template, data);
            }
            return false;
        },
    });

});
