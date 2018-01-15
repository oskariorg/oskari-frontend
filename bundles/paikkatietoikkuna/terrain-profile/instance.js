Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundleInstance',
    function () {
        this.active = false;
        this.feature = null;
        this.popup = null;
        this.flyout = null;
        this.loc = Oskari.getMsg.bind(null, 'TerrainProfile');

        function requestFunction(requestName, args) {
            var builder = Oskari.requestBuilder(requestName);
            if (!builder) {
                return false;
            }
            var request = builder.apply(null, args);
            this.sandbox.request(this, request);
            return true;
        }
        this.markerHandler = Oskari.clazz.create('Oskari.mapframework.bundle.terrain-profile.MarkerHandler', requestFunction.bind(this));
    },
    {
        __name: 'TerrainProfile',
        _startImpl: function (sandbox) {
            var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            var buttonConf = {
                iconCls: 'tool-terrainprofile',
                tooltip: this.loc('terrainHeightProfile'),
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
                this.active = false;
                this.popup.close();
                this.stopDrawing();
                this.popup = null;
                if (this.flyout) {
                    this.flyout.hide();
                }
                this.feature = null;
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
                success: this.showFlyout.bind(this),
                error: function (jqXHR, textStatus, errorThrown) {
                    Oskari.log('TerrainProfile').warn('Could not load terrain profile data: ' + errorThrown);
                }
            });
            this.showFlyout(null);
        },
        showFlyout: function (data) {
            if (this.flyout) {
                this.flyout.update(data);
            } else {
                var p = jQuery( "#mapdiv" );
                var position = p.position().left;
                var offset = 40;
                this.flyout = Oskari.clazz.create('Oskari.mapframework.bundle.terrain-profile.TerrainFlyout', this.loc('terrainHeightProfile'), {
                    width: 'auto'
                }, this.markerHandler);
                this.flyout.move(position + offset, 0, true);
                this.flyout.update(data);
            }
            this.flyout.show();
        },
        eventHandlers: {
            'DrawingEvent': function (event) {
                var drawId = event.getId();
                if (drawId !== this.__name || !this.active) {
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
