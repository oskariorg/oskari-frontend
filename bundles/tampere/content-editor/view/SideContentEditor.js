/**
 * @class Oskari.tampere.bundle.content-editor.view.SideContentEditor
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.view.SideContentEditor',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param {string} layerId
     */
    function (instance, localization, layerId) {
        var me = this;
        me.layerId = layerId;
        me.sandbox = instance.sandbox;
        me.instance = instance;
        me.templates = {
        		wrapper: '<div></div>',
                getinfoResultTable: '<table class="getinforesult_table"></table>',
                tableRow: '<tr></tr>',
                tableCell: '<td></td>',
                header: '<div class="getinforesult_header"><div class="icon-bubble-left"></div>',
                headerTitle: '<div class="getinforesult_header_title"></div>',
                linkOutside: '<a target="_blank"></a>'
        };
        me.template = jQuery(
            '<div class="content-editor">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div>');
        me.allVisibleLayers = [];
        me.allLayers = null;
        me.loc = localization;
        me.mainPanel = null;
        me.isLayerVisible = true;
        me.mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = me.template.clone();
            
            me.mainPanel = content;

            container.append(content);
            $(".icon-close").on('click', function(){
            	me.instance.setEditorMode(false);
            });

            content.find('div.header h3').append(me.loc.title);

            content.find('.content').append($("<div>" + me.loc.featureModifyInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.toolInfo + "</div>"));
            content.find('.content').append($("<div>" + me.loc.geometryModifyInfo + "</div>"));

            //var pointButton = $("<div />").addClass('myplaces-draw-point tool');
            //var lineButton = $("<div />").addClass('myplaces-draw-line tool');
            //var areaButton = $("<div />").addClass('myplaces-draw-area tool');
            
            var pointButton = $("<div />").addClass('add-point tool');
            var lineButton = $("<div />").addClass('add-line tool');
            var areaButton = $("<div />").addClass('add-area tool');
            
            var toolContainer = $("<div />").addClass('toolrow');
            toolContainer.append(pointButton);
            toolContainer.append(lineButton);
            toolContainer.append(areaButton);
            
            content.find('.content').append(toolContainer);
            content.find('.content').append($("<div />").addClass("properties-container"));
            
            me.allLayers = me.sandbox.findAllSelectedMapLayers();
            
            if (!me._checkLayerVisibility(me.layerId)) {
            	me.isLayerVisible = false;
            	me._setLayerVisibility(me.layerId, true);
            }
            me._hideLayers();
            me._disableGFI();
        },

        /**
         * @method destroy
         * Destroys/removes this view from the screen.
         *
         *
         */
        destroy: function () {
        	var me = this;
        	me._showLayers();
        	
        	var gfiActivationRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(true);
            me.sandbox.request(me.instance.getName(), request);
            
            if (!me.isLayerVisible) {
            	me._setLayerVisibility(me.layerId, false);
            }
            
            this.mainPanel.remove();
        },
        /**
         * @method _removeLayers
         * Removes temporarily layers from map that the user cant publish
         * @private
         */
        _hideLayers: function () {
            var me = this,
                sandbox = me.sandbox,
                removeRequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest'),
                i,
                layer;
            
            for (i = 0; i < me.allLayers.length; i++) {
            	if (me.allLayers[i].isVisible()) {
            		me.allVisibleLayers.push(me.allLayers[i]);
            	}
            }

            if (me.allVisibleLayers) {
                for (i = 0; i < me.allVisibleLayers.length; i += 1) {
                    layer = me.allVisibleLayers[i];
                    if (me.layerId != layer.getId() && layer.isLayerOfType("WFS")) {
                    	me._setLayerVisibility(layer.getId(), false);
                    }
                }
            }
        },
        _showLayers: function () {
        	var me = this;
        	for (var i = 0; i < me.allVisibleLayers.length; i++) {
        		me._setLayerVisibility(me.allVisibleLayers[i].getId(), true);
        	}
        },
        _disableGFI: function () {
        	var me = this;
        	var gfiActivationRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(false);
            me.sandbox.request(me.instance.getName(), request);
        },
        _checkLayerVisibility: function (layerId) {
        	var me = this;
        	var layer = me._getLayerById(layerId);
        	if (layer.isVisible()) {
        		return true;
        	}
        	return false;
        },
        _setLayerVisibility: function (layerId, setVisible) {
        	var me = this;
        	
        	var visibilityRequestBuilder = me.sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
        	var request = visibilityRequestBuilder(layerId, setVisible);
            me.sandbox.request(me.instance.getName(), request);
        },
        _getLayerById: function (layerId) {
        	var me = this;
        	for (var i = 0; i < me.allLayers.length; i++) {
        		if (me.allLayers[i].getId() == layerId) {
        			return me.allLayers[i];
        		}
        	}
        },
        _handleInfoResult: function (data) {
            var content = [],
                contentData = {},
                fragments = [],
                colourScheme,
                font;

            fragments = this._formatWFSFeaturesForInfoBox(data);

            if (fragments.length) {
                contentData.actions = {};
                contentData.html = this._renderFragments(fragments);
                contentData.layerId = fragments[0].layerId;
                content.push(contentData);
                $(".properties-container").empty().append(contentData.html);
            }
        },
        /**
         * @method _formatWFSFeaturesForInfoBox
         */
        _formatWFSFeaturesForInfoBox: function (data) {
            var me = this,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(data.layerId),
                isMyPlace = layer.isLayerOfType('myplaces'),
                fields = layer.getFields().slice(),
                hiddenFields = ['__fid', '__centerX', '__centerY'],
                type = 'wfslayer',
                result,
                markup;

            if (data.features === 'empty' || layer === null || layer === undefined) {
                return;
            }
            
            if (!isMyPlace) {
                // replace fields with locales
                fields = _.chain(fields)
                    .zip(layer.getLocales().slice())
                    .map(function (pair) {
                        // pair is an array [field, locale]
                        if (_.contains(hiddenFields, _.first(pair))) {
                            // just return the field name for now if it's hidden
                            return _.first(pair);
                        }
                        // return the localized name or field if former is undefined
                        return _.last(pair) || _.first(pair);
                    })
                    .value();
            }

            result = _.map(data.features, function (feature) {
                var feat = _.chain(fields)
                    .zip(feature)
                    .filter(function (pair) {
                        return !_.contains(hiddenFields, _.first(pair));
                    })
                    .foldl(function (obj, pair) {
                        obj[_.first(pair)] = _.last(pair);
                        return obj;
                    }, {})
                    .value();
                
                if (isMyPlace) {
                    markup = me._formatMyPlacesGfi(feat);
                } else {
                    markup = me._json2html(feat);
                }
                return {
                    markup: markup,
                    layerId: data.layerId,
                    layerName: layer.getName(),
                    type: type,
                    isMyPlace: isMyPlace
                };
            });

            return result;
        },
        /**
         * @method _json2html
         * @private
         * Parses and formats a WFS layers JSON GFI response
         * @param {Object} node response data to format
         * @return {String} formatted HMTL
         */
        _json2html: function (node) {
            // FIXME this function is too complicated, chop it to pieces
            if (node === null || node === undefined) {
                return '';
            }
            var even = true,
                html = $(this.templates.getinfoResultTable),
                row = null,
                keyColumn = null,
                valColumn = null,
                key,
                value,
                vType,
                valpres,
                valueDiv,
                innerTable,
                i;

            for (key in node) {
                if (node.hasOwnProperty(key)) {
                    value = node[key];

                    if (value === null || value === undefined ||
                            key === null || key === undefined) {
                        continue;
                    }
                    vType = (typeof value).toLowerCase();
                    valpres = '';
                    switch (vType) {
                    case 'string':
                        if (value.indexOf('http://') === 0) {
                            valpres = $(this.templates.linkOutside);
                            valpres.attr('href', value);
                            valpres.append(value);
                        } else {
                            valpres = value;
                        }
                        break;
                    case 'undefined':
                        valpres = 'n/a';
                        break;
                    case 'boolean':
                        valpres = (value ? 'true' : 'false');
                        break;
                    case 'number':
                        valpres = '' + value;
                        break;
                    case 'function':
                        valpres = '?';
                        break;
                    case 'object':
                        // format array
                        if (jQuery.isArray(value)) {
                            valueDiv = $(this.templates.wrapper);
                            for (i = 0; i < value.length; i += 1) {
                                innerTable = this._json2html(value[i]);
                                valueDiv.append(innerTable);
                            }
                            valpres = valueDiv;
                        } else {
                            valpres = this._json2html(value);
                        }
                        break;
                    default:
                        valpres = '';
                    }
                    even = !even;

                    row = $(this.templates.tableRow);
                    // FIXME this is unnecessary, we can do this with a css selector.
                    if (!even) {
                        row.addClass('odd');
                    }

                    keyColumn = $(this.templates.tableCell);
                    keyColumn.append(key);
                    row.append(keyColumn);

                    valColumn = $(this.templates.tableCell);
                    valColumn.append(valpres);
                    row.append(valColumn);

                    html.append(row);
                }
            }
            return html;
        },
        /**
         * Wraps the html feature fragments into a container.
         *
         * @method _renderFragments
         * @private
         * @param  {Object[]} fragments
         * @return {jQuery}
         */
        _renderFragments: function (fragments) {
            var me = this;

            return _.foldl(fragments, function (wrapper, fragment) {
                var fragmentTitle = fragment.layerName,
                    fragmentMarkup = fragment.markup;

                if (fragment.isMyPlace) {
                    if (fragmentMarkup) {
                        wrapper.append(fragmentMarkup);
                    }
                } else {
                    var contentWrapper = $(me.templates.wrapper),
                        headerWrapper = $(me.templates.header),
                        titleWrapper = $(me.templates.headerTitle);

                    titleWrapper.append(fragmentTitle);
                    titleWrapper.attr('title', fragmentTitle);
                    headerWrapper.append(titleWrapper);
                    contentWrapper.append(headerWrapper);

                    if (fragmentMarkup) {
                        contentWrapper.append(fragmentMarkup);
                    }
                    wrapper.append(contentWrapper);
                }

                delete fragment.isMyPlace;

                return wrapper;
            }, $(me.templates.wrapper));
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
