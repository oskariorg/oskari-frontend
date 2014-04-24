Oskari.clazz.define('Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StartDrawFilteringRequest',

function(config) {
    if (config.geometry) {
        // editing existing
        this._geometry = config.geometry;
    } else if (config.continueCurrent) {
        // editing new
        this._continueCurrent = config.continueCurrent;
    } else {
        // start drawing new
        if (!this.modes[config.mode]) {
            throw "Unknown draw filter mode '" + config.mode + "'";
        }
        this._mode = config.mode;
    }

    // Selected geometry
    if (config.selectedGeometry) {
        this._selectedGeometry = config.selectedGeometry;
    }

}, {
    __name : "DrawFilterPlugin.StartDrawFilteringRequest",
    getName : function() {
        return this.__name;
    },

    isModify : function() {
        if (this._continueCurrent) {
            return true;
        }
        return false;
    },

    modes : {
        point : 'point',
        line : 'line',
        edit : 'edit',
        remove : 'remove'
    },

    getMode : function() {
        return this._mode;
    },

    getGeometry : function() {
        return this._geometry;
    },

    getSelectedGeometry : function() {
        return this._selectedGeometry;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});