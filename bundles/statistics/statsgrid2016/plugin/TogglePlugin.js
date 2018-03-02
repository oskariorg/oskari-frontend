Oskari.clazz.define('Oskari.statistics.statsgrid.TogglePlugin', function( flyoutManager, locale ) {
    var me = this;
    this.flyoutManager = flyoutManager;
    this.locale = locale;
    this.element = null;
    this._clazz = 'Oskari.statistics.statsgrid.TogglePlugin';
    this._index = 4;
    this._defaultLocation = 'bottom right';

    this.flyoutManager.on('show', function (tool) {
        me.toggleTool(tool, true);
    });
    this.flyoutManager.on('hide', function (tool) {  
        me.toggleTool(tool, false);
    });
}, {
    toggleTool: function (tool, shown) {
        var toolElement = this.getToolElement(tool);

        if ( !toolElement ) {
            return;
        }
        if ( !shown ) {
            toolElement.removeClass('active');
            return;
        }
        toolElement.addClass('active');
    },
    addTool: function ( toolId ) {
        var me = this;

        if ( !this.element ) {
            this.redrawUI();
        }

        var toolElement = jQuery('<div class='+ toolId +'></div>');

        toolElement.bind('click', function () {
            me.flyoutManager.toggle(toolId);
        });
        this.element.append(toolElement);
    },
    removeTool: function (toolId) {
        var toolElement = this.getToolElement(toolId);
        if ( toolElement ) {
            toolElement.remove();
        }
        this.flyoutManager.hide(toolId);
    },
    getToolElement: function ( toolId ) {
        if ( !this.element ) {
            return;
        }
        return this.element.find('.' + toolId);
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        if(this.element) {
            return this.element;
        }
        var toggleButtons = jQuery('<div class="statsgrid-published-toggle-buttons mapplugin" />');

        this.element = toggleButtons;
        return this.element;
    },
    /**
     * Handle plugin UI and change it when desktop / mobile mode
     * @method  @public redrawUI
     */
    redrawUI: function() {
        this.element = this._createControlElement();
        this.addToPluginContainer( this.element );
    },
    teardownUI : function(stopping) {
        //detach old element from screen
        this.removeFromPluginContainer(this._element, !stopping);
        if(stopping) {
            this.element = null;
        }
    },
    stopPlugin: function() {
        this.teardownUI(true);
    }
}, {
    'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @static @property {string[]} protocol array of superclasses
     */
    'protocol': [
        "Oskari.mapframework.module.Module",
        "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
    ]
});
