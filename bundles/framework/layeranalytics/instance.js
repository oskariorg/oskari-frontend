// state values for layer loading statuses
const STATE = {
    ERROR: 'error',
    SUCCESS: 'success'
};

/**
 * @class Oskari.pti.layerstatus.StatusBundleInstance
 */
Oskari.clazz.define('Oskari.layeranalytics.StatusBundleInstance', function () {
    // no-op
}, {
    __name: 'LayerStatusBundleInstance',
    __loadingStatus: {},
    _startImpl: function (sandbox) {
        const map = sandbox.findRegisteredModuleInstance('MainMapModule');
        map.on('layer.loading', (event) => {
            // event: {layer: 801, started: true, errored: false}
            if (event.started) {
                // don't care about start events
                return;
            }
            this._handleLoadingEvent(event.layer, event.errored);
        });

        window.addEventListener('beforeunload', () => {
            // just fire and forget when the user leaves the page
            this._sendStatus();
        });
    },
    _handleLoadingEvent: function (layer, wasError) {
        const stats = this._getLayerStatus(layer);
        let currentState = STATE.SUCCESS;
        if (wasError) {
            stats.errors++;
            currentState = STATE.ERROR;
        } else {
            stats.success++;
        }

        if (stats.previous !== currentState) {
            stats.previous = currentState;
            // for the first 10 state changes:
            // save stack for current state with center coord and zoom level
            if (stats.stack.length < 10) {
                const mapState = this.sandbox.getMap();
                stats.stack.push({
                    x: mapState.getX(),
                    y: mapState.getY(),
                    z: mapState.getZoom(),
                    state: currentState,
                    layers: mapState.getLayers().map(l => l.getId())
                });
            }
        }
    },
    _getLayerStatus: function (layerId, includeVector = false) {
        const NON_TRACKED_LAYER = 'runtimeVector';
        if (!layerId) {
            const status = {
                ...this.__loadingStatus
            };
            if (!includeVector) {
                delete status[NON_TRACKED_LAYER];
            }
            return status;
        }
        let id = '' + layerId;
        // combine results for recognized layer ids from same (internal) service
        if (typeof layerId !== 'number') {
            if (id.startsWith('myplaces_') || id.startsWith('userlayer_') || id.startsWith('analysis_')) {
                id = 'usercontent';
            } else {
                // STATS_LAYER and other runtime vector layers
                id = NON_TRACKED_LAYER;
            }
        }

        const stats = this.__loadingStatus[id];
        if (stats) {
            return stats;
        }
        this.__loadingStatus[id] = {
            errors: 0,
            success: 0,
            stack: [],
            previous: STATE.SUCCESS
        };
        return this.__loadingStatus[id];
    },
    _sendStatus: function () {
        fetch(Oskari.urls.getRoute('LayerStatus'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this._getLayerStatus())
        });
    }
}, {
    extend: ['Oskari.BasicBundle'],
    protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});
