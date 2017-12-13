Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundleInstance',
    function () {
        this.active = false;
        this.feature = null;
        this.popup = null;
    },
    {
        __name: 'TerrainProfile',
        _startImpl: function (sandbox) {
            var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            var buttonConf = {
                iconCls: 'upload-material',
                tooltip: 'Terrain height profile',
                sticky: true,
                callback: function (el) { }
            };
            sandbox.request(this, addToolButtonBuilder('TerrainProfile', 'basictools', buttonConf));
        },
        setActive: function (activeState) {
            if (activeState) {
                if (this.active) {
                    return;
                }
                this.popup = this.createPopup();
                this.startDrawing();
                this.active = true;
            } else {
                if (!this.active) {
                    return;
                }
                this.popup.close();
                this.stopDrawing();
                this.popup = null;
                this.feature = null;
                this.active = false;
            }
        },
        cancelTool: function () {
            var builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            this.sandbox.request(this, builder());
        },
        createPopup: function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.terrain-profile.TerrainPopup',
                this.cancelTool.bind(this),
                this.doQuery.bind(this)
            );
        },
        startDrawing: function () {
            var builder = Oskari.requestBuilder('DrawTools.StartDrawingRequest');
            this.sandbox.request(this, builder(this.__name, 'LineString', {modifyControl: true}));
        },
        stopDrawing: function () {
            var builder = Oskari.requestBuilder('DrawTools.StopDrawingRequest');
            this.sandbox.request(this, builder(this.__name, true));
        },
        doQuery: function () {
            if (!this.feature) {
                return;
            }
            this.feature.properties = {numPoints: 100};
            var url = this.sandbox.getAjaxUrl() + 'action_route=TerrainProfile&route=' + encodeURIComponent(JSON.stringify(this.feature));
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                success: function (response) {
                    console.log(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        },
        eventHandlers: {
            'DrawingEvent': function (event) {
                var drawId = event.getId();
                if (drawId !== this.__name) {
                    return;
                }
                if (event.getIsFinished()) {
                    this.feature = event.getGeoJson().features[0];
                    this.doQuery();
                } else {
                    var sketch = event.getGeoJson().features[0];
                    if (!sketch || sketch.geometry.coordinates.length <= 2) {
                        this.feature = null;
                        return;
                    }
                    var feature = {type: 'Feature', geometry: {type: 'LineString'}};
                    feature.geometry.coordinates = sketch.geometry.coordinates.slice(sketch.geometry.coordinates.length - 1);
                    this.feature = feature;
                }
            },
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() === 'TerrainProfile') {
                    this.setActive(true);
                } else {
                    this.setActive(false);
                }
            }
        }
    },
    {
        extend: ['Oskari.mapframework.bundle.terrain-profile.BundleModule'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
