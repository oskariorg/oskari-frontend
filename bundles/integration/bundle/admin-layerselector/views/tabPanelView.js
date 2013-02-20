define( 
    function() {
    return Backbone.View.extend({
        tagName: 'div',
        className: 'tab-content',
        initialize : function() {
            //this.template = _.template(Template);
            //this.el = this.options.el;
            this.render();
        },
        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            console.log('render tab-content');            
        }

    });
});
