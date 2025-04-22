import olOverlay from 'ol/Overlay';

/**
 * @class Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin
 *
 * Extends jquery by defining outerHtml() method for it. (TODO: check if we really want to do it here).
 * Provides a customized popup functionality for Openlayers map.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin';
        me._name = 'OpenLayersPopupPlugin';

        me._popups = {};
        me.markers = {};
        me.markerPopups = {};

        me._mobileBreakpoints = {
            width: 500,
            height: 480
        };

        me._positionClasses = {
            'left': 'center-right',
            'right': 'center-left',
            'top': 'bottom-center',
            'bottom': 'top-center'
        };
        // popup max size = map size * 0.7
        me._viewportMargins = {
            'top': 60,
            'right': 100,
            'bottom': 40,
            'left': 50,
            'isInViewport': 20
        };

        me.log = Oskari.log('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin');
    }, {

        /**
         * @private @method _initImpl
         * implements Module protocol init method - declares popup templates
         */
        _initImpl: function () {
            var me = this;

            // templates
            me._arrow = jQuery('<div class="popupHeaderArrow"></div>');
            me._header = jQuery('<div></div>');
            me._popupHeaderTitle = jQuery('<div class="popupHeaderTitle"></div>');
            me._headerWrapper = jQuery('<div class="popupHeader"></div>');
            // FIXME move styles to css
            me._headerCloseButton = jQuery(
                '<div class="olPopupCloseBox icon-close-white"></div>'
            );
            me._headerAdditionalButton = jQuery(
                '<div class="icon-close-white"></div>'
            );
            me._contentDiv = jQuery('<div class="popupContent"></div>');
            me._contentWrapper = jQuery('<div class="contentWrapper-infobox"></div>');
            me._actionLink = jQuery(
                '<span class="infoboxActionLinks"><a href="#"></a></span>'
            );
            me._actionTemplateWrapper = jQuery('<div class="actionTemplateWrapper"></div>');
            me._actionButton = jQuery(
                '<span class="infoboxActionLinks">' +
                '  <input type="button" />' +
                '</span>'
            );
            me._contentSeparator = jQuery(
                '<div class="infoboxLine">separator</div>'
            );
            me._popupWrapper = jQuery(
                '<div class="olPopup"></div>'
            );
        },

        /**
         * @method popup
         * @param {String} id
         *      id for popup so we can use additional requests to control it
         * @param {String} title
         *      popup title
         * @param {Object[]} contentData
         *      JSON presentation for the popup data
         * @param {OpenLayers.LonLat|Object} position
         *      lonlat coordinates where to show the popup or marker id {marker:'MARKER_ID'}
         * @param {Object} options
         *      additional options for infobox
         *
         * Displays a popup with given title and data in the given coordinates.
         *
         * contentData format example:
         * [{
         *  html: "",
         *  useButtons: true,
         *  primaryButton: "<button label>",
         *  actions : {
         *     "Tallenna" : callbackFunction,
         *     "Sulje" : callbackFunction
         * }
         * }]
         */
        popup: function (id, title, contentData, position, options, additionalTools) {
            var me = this;
            if (typeof contentData !== 'object' || !Object.keys(contentData).length) {
                return;
            }
            var currPopup = me._popups[id];
            var lon = null;
            var lat = null;
            var marker = null;

            if (position.marker && me.markers[position.marker]) {
                lon = me.markers[position.marker].data.x;
                lat = me.markers[position.marker].data.y;
                marker = me.markers[position.marker];
                me.markerPopups[position.marker] = id;
            } else if (typeof position.lon === 'number' && typeof position.lat === 'number') {
                lon = position.lon;
                lat = position.lat;
            } else {
                // Send a status report of the popup (it is not open)
                var evtB = Oskari.eventBuilder('InfoBox.InfoBoxEvent');
                var evt = evtB(id, false);
                me.getSandbox().notifyAll(evt);
                return;
            }
            var refresh = (currPopup &&
                    currPopup.lonlat.lon === lon &&
                    currPopup.lonlat.lat === lat);

            if (currPopup && !refresh) {
                if (me._popups[id].type === 'mobile') {
                    me._popups[id].popup.dialog.remove();
                    me._popups[id].popup.__notifyListeners('close');
                } else {
                    me.close(id);
                }
                delete me._popups[id];
            }

            if (refresh) {
                contentData = currPopup.contentData.concat(contentData);
                currPopup.contentData = contentData;
            }

            me._renderPopup(id, contentData, title, { lon: lon, lat: lat }, options, refresh, additionalTools, marker);
        },

        /**
         * @method _renderPopup
         */
        _renderPopup: function (id, contentData, title, lonlat, options, refresh, additionalTools, marker) {
            var me = this,
                contentDiv = me._renderContentData(id, contentData),
                sanitizedTitle = Oskari.util.sanitize(title),
                popupContentHtml = me._renderPopupContent(id, sanitizedTitle, contentDiv, additionalTools, lonlat, options.showCoordinates),
                popupElement = me._popupWrapper.clone(),
                lonlatArray = [lonlat.lon, lonlat.lat],
                colourScheme = options.colourScheme,
                font = options.font,
                offsetX = 0,
                offsetY = -20,
                mapModule = me.getMapModule(),
                isMarker = !!((marker && marker.data)),
                positioning = options && options.positioning && me._positionClasses && me._positionClasses[options.positioning] ? me._positionClasses[options.positioning] : 'no-position-info',
                popupType,
                popupDOM,
                popup;

            const mapTheme = mapModule.getMapTheme();
            if (mapTheme) {
                colourScheme = {
                    bgColour: mapTheme?.infobox?.header?.bg,
                    titleColour: mapTheme?.infobox?.header?.text,
                    ...colourScheme
                };
            }

            jQuery(contentDiv).addClass('infoboxPopupNoMargin');
            if (isMarker) {
                var markerPosition = mapModule.getSvgMarkerPopupPxPosition(marker);
                offsetX = markerPosition.x;
                offsetY = markerPosition.y;
            }

            if (!options.mobileBreakpoints) {
                options.mobileBreakpoints = me._mobileBreakpoints;
            }
            var isInMobileMode = this._isInMobileMode(options.mobileBreakpoints);

            popupElement.attr('id', id);
            if (refresh) {
                popup = me._popups[id].popup;
                if (isInMobileMode) {
                    popupType = 'mobile';
                    popup.setContent(contentDiv);
                } else {
                    popupDOM = jQuery('#' + id);
                    popupType = 'desktop';
                    jQuery(popup.getElement()).empty();
                    jQuery(popup.getElement()).html(popupContentHtml);
                    popup.setPosition(lonlatArray);
                    if (positioning) {
                        popupDOM.removeClass(positioning);
                        popupDOM.find('.popupHeaderArrow').removeClass(positioning);

                        popupDOM.addClass(positioning);
                        popupDOM.find('.popupHeaderArrow').addClass(positioning);
                    }
                    if (colourScheme) {
                        me._changeColourScheme(colourScheme, popupDOM, id);
                    }
                }
            } else if (isInMobileMode) {
                popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                popupType = 'mobile';

                popup.createCloseIcon();
                me._showInMobileMode(popup);

                if (font) {
                    popup.setFont(font);
                }

                popup.show(sanitizedTitle, contentDiv);

                if (colourScheme) {
                    popup.setColourScheme(colourScheme);
                }
                popup.onClose(function () {
                    me.close(id);
                });
            } else {
                popupType = 'desktop';
                popupElement.html(popupContentHtml);
                popup = new olOverlay({
                    element: popupElement[0],
                    // start with null positioning
                    positioning: null,
                    stopEvent: true,
                    offset: [offsetX, offsetY]
                });
                mapModule.getMap().addOverlay(popup);
                popup.setPosition(lonlatArray);

                jQuery(popup.div).css('overflow', 'visible');
                jQuery(popup.groupDiv).css('overflow', 'visible');

                popupDOM = jQuery('#' + id);
                if (positioning) {
                    popupDOM.addClass(positioning);
                    popupDOM.find('.popupHeaderArrow').addClass(positioning);
                }

                // Set the colour scheme if one provided
                if (colourScheme) {
                    me._changeColourScheme(colourScheme, popupDOM, id);
                }
                // Set the font if one provided
                if (font) {
                    me._changeFont(font, popupDOM, id);
                }
                // Fix the HTML5 placeholder for < IE10
                var inputs = popupDOM.find(
                    '.contentWrapper input, .contentWrapper textarea'
                );
                if (typeof inputs.placeholder === 'function') {
                    inputs.placeholder();
                }
            }

            me._popups[id] = {
                title: sanitizedTitle,
                contentData: contentData,
                lonlat: lonlat,
                popup: popup,
                options: options,
                isInMobileMode: isInMobileMode,
                type: popupType
            };

            if (me.adaptable && !isInMobileMode) {
                if (positioning && positioning !== 'no-position-info') {
                    me._adaptPopupSizeWithPositioning(id, refresh);
                    // if refresh, we need to reset the positioning
                    if (refresh) {
                        popup.setPositioning(null);
                    }
                    // update the correct positioning (width + height now known so the position in pixels gets calculated correctly by ol)
                    popup.setPositioning(positioning);
                } else {
                    me._adaptPopupSize(id, refresh);
                }
            }

            const { keepOnScreen = true } = options;
            if (popupType === 'desktop' && keepOnScreen) {
                setTimeout(me._panMapToShowPopup.bind(me, lonlatArray, positioning), 0);
            }

            me._setClickEvent(id, popup, contentData, additionalTools, isInMobileMode);
        },

        _isInMobileMode: function (mobileBreakpoints) {
            var screenWidth = window.innerWidth,
                screenHeight = window.innerHeight;
            if (mobileBreakpoints.width) {
                if (screenWidth < mobileBreakpoints.width) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (screenHeight < mobileBreakpoints.height) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        _showInMobileMode: function (popup) {
            popup.makeModal();
            popup.overlay.followResizing(true);
            popup.overlay.bindClickToClose();
            popup.overlay.onClose(function () {
                popup.dialog.remove();
                popup.__notifyListeners('close');
            });
            popup.dialog.addClass('mobile-infobox');
        },

        _formatNumber: function (coordinate, decimalSeparator) {
            if (typeof coordinate !== 'string') {
                coordinate = coordinate + '';
            }
            coordinate = coordinate.replace('.', decimalSeparator);
            coordinate = coordinate.replace(',', decimalSeparator);
            return coordinate;
        },

        /**
         * Wraps the content into popup and returns the html string.
         *
         * @method _renderPopupContent
         * @private
         * @param  {String} id
         * @param  {String} title
         * @param  {jQuery} contentDiv
         * @param  {Object} additionalTools
         * @param  {Object} lonlat
         * @param  {Boolean} showCoordinates
         * @return {String}
         */
        _renderPopupContent: function (id, title, contentDiv, additionalTools, lonlat, showCoordinates) {
            var me = this,
                arrow = this._arrow.clone(),
                header = this._header.clone(),
                popupHeaderTitle = this._popupHeaderTitle.clone(),
                headerWrapper = this._headerWrapper.clone(),
                closeButton = this._headerCloseButton.clone(),
                resultHtml;

            closeButton.attr('id', 'oskari_' + id + '_headerCloseButton');
            header.append(title);
            popupHeaderTitle.append(header);
            popupHeaderTitle.append(closeButton);

            // add additional btns
            jQuery.each(additionalTools, function (index, key) {
                var additionalButton = me._headerAdditionalButton.clone();
                additionalButton.attr({
                    'id': key.name,
                    'class': key.iconCls,
                    'style': key.styles
                });
                popupHeaderTitle.append(additionalButton);
            });

            headerWrapper.append(popupHeaderTitle);

            // render coordinates to gfi header
            if (showCoordinates) {
                let mapModule = this.getMapModule();
                let loc = Oskari.getLocalization('oskariui');
                let crs = mapModule.getProjection();

                let coordinateWrapper = jQuery('<div class="coordinateWrapper"></div>');

                let lat = parseFloat(lonlat?.lat);
                let lon = parseFloat(lonlat?.lon);

                let lonlatString = '';

                // Need to show degrees ?
                if (mapModule.getProjectionUnits() === 'degrees' && !isNaN(lat) && !isNaN(lon)) {
                    // Hard code restrict to 6 decimals
                    const degreePoint = Oskari.util.coordinateMetricToDegrees([lon, lat], 6);
                    lon = degreePoint[0];
                    lat = degreePoint[1];
                    lonlatString = loc.coordinates.lat + ': ' + lat + ' ' + loc.coordinates.lon + ': ' + lon;
                }
                // Otherwise show meter units
                else if (!isNaN(lat) && !isNaN(lon)) {
                    lat = lat.toFixed();
                    lon = lon.toFixed();
                    lat = me._formatNumber(lat, me.decimalSeparator);
                    lon = me._formatNumber(lon, me.decimalSeparator);
                    lonlatString = loc.coordinates.n + ': ' + lat + ' ' + loc.coordinates.e + ': ' + lon;
                }

                let crsText = loc.coordinates.crs[crs] || crs;
                let crsDiv = crsText.length > 0 ? jQuery('<div>' + crsText + '</div>') : null;

                if (crsDiv && lonlatString.length > 0) {
                    coordinateWrapper.append(crsDiv);
                    coordinateWrapper.append(lonlatString);
                    headerWrapper.append(coordinateWrapper);
                } else {
                    me.log.warn('Error creating coordinate info for GFI popup.');
                }
            }

            resultHtml = arrow.outerHTML() +
                headerWrapper.outerHTML() +
                contentDiv.outerHTML();

            return resultHtml;
        },

        /**
         * Renders the content data into html presentation.
         * Also creates links/buttons for the actions.
         *
         * @method _renderContentData
         * @private
         * @param  {Object[]} contentData
         * @return {jQuery}
         */
        _renderContentData: function (id, contentData = []) {
            var me = this;
            const baseDiv = this._contentDiv.clone();
            contentData.map((datum, index) => {
                const contentWrapper = me._contentWrapper.clone();
                if (typeof datum.html === 'string') {
                    contentWrapper.append(Oskari.util.sanitize(datum.html));
                } else if (typeof datum.html === 'object') {
                    contentWrapper.append(Oskari.util.sanitize(datum.html.outerHTML()));
                }
                contentWrapper.attr('id', 'oskari_' + id + '_contentWrapper');

                if (!datum.actions) {
                    return contentWrapper;
                }
                if (!Array.isArray(datum.actions)) {
                    me.log.warn('Popup actions must be an Array. Cannot add tools.');
                    return contentWrapper;
                }
                // attach links for the infobox segment
                let group;
                let actionTemplateWrapper;
                datum.actions.forEach(function (action) {
                    var sanitizedActionName = Oskari.util.sanitize(action.name);
                    let actionTemplate;
                    if (action.type === 'link') {
                        actionTemplate = me._actionLink.clone();
                        const link = actionTemplate.find('a');
                        link.attr('contentdata', index);
                        link.attr('id', 'oskari_' + id + '_actionLink');
                        link.append(sanitizedActionName);
                    } else if (action.name) {
                        actionTemplate = me._actionButton.clone();
                        const btn = actionTemplate.find('input');
                        btn.attr({
                            contentdata: index,
                            value: sanitizedActionName
                        });
                    }
                    const currentGroup = action.group;
                    let targetElem = null;
                    if (action.selector) {
                        targetElem = contentWrapper.find(action.selector);
                    }
                    if (targetElem instanceof jQuery) {
                        targetElem.prepend(actionTemplate);
                    } else if (currentGroup !== undefined && currentGroup === group) {
                        actionTemplateWrapper.append(actionTemplate);
                    } else {
                        actionTemplateWrapper = me._actionTemplateWrapper.clone();
                        actionTemplateWrapper.append(actionTemplate);
                        contentWrapper.append(actionTemplateWrapper);
                    }
                    group = currentGroup;
                });

                return contentWrapper;
            }).forEach(data => baseDiv.append(data));
            return baseDiv;
        },

        _setClickEvent: function (id, popup, contentData, additionalTools = [], isMobilePopup) {
            const me = this;
            const sandbox = this.getMapModule().getSandbox();
            let popupElement;

            if (isMobilePopup) {
                popupElement = popup.dialog[0];
            } else {
                popupElement = popup.getElement();
            }

            popupElement.onclick = function (evt) {
                const link = jQuery(evt.target || evt.srcElement);

                if (link.hasClass('olPopupCloseBox')) { // Close button
                    me.close(id);
                    evt.stopPropagation();
                    return;
                } else { // Action links
                    const i = link.attr('contentdata');
                    let text = link.attr('value');
                    if (!text) {
                        text = link.html();
                    }
                    if (contentData[i] && contentData[i].actions) {
                        const actions = contentData[i].actions;
                        var actionObject = actions.find(action => action.name === text);
                        if (typeof actionObject.action === 'function') {
                            actionObject.action();
                        } else {
                            var event = Oskari.eventBuilder('InfoboxActionEvent')(id, text, actionObject.action);
                            sandbox.notifyAll(event);
                        }
                    }
                }
                additionalTools.forEach((key) => {
                    if (link.hasClass(key.iconCls)) {
                        me.close(id);
                        key.callback(key.params);
                    }
                });

                if (!link.is('a') || link.parents('.getinforesult_table').length) {
                    evt.stopPropagation();
                }
            };
        },

        /**
         * Removes the data of given id from the popup and
         * renders it again to reflect the change.
         *
         * @method removeContentData
         * @private
         * @param  {String} popupId
         * @param  {String} contentId
         */
        removeContentData: function (popupId, contentId) {
            var popup = this.getPopups(popupId),
                removed = false,
                cLen,
                contentData,
                datum,
                i;

            if (!popup) {
                return;
            }

            contentData = popup.contentData;

            for (i = 0, cLen = contentData.length; i < cLen; i += 1) {
                datum = contentData[i];
                if (datum.layerId && ('' + datum.layerId === '' + contentId)) {
                    contentData.splice(i, 1);
                    removed = true;
                    break;
                }
            }

            if (removed) {
                if (contentData.length === 0) {
                    // No content left, close popup
                    this.close(popupId);
                } else {
                    const { title, lonlat, options } = popup;
                    this._renderPopup(
                        popupId,
                        contentData,
                        title,
                        lonlat,
                        options || {},
                        true
                    );
                }
            }
        },
        setAdaptable: function (isAdaptable) {
            this.adaptable = isAdaptable;
        },

        _adaptPopupSize: function (olPopupId, isOld) {
            var size = this.getMapModule().getSize(),
                popup = jQuery('#' + olPopupId),
                left = parseFloat(popup.css('left')),
                maxWidth = size.width * 0.7,
                maxHeight = size.height * 0.7;

            if (isNaN(left)) {
                left = 0;
            }

            // popup needs to move 10 pixels to the right
            // so that header arrow can be moved out of container(left).
            // Only move it if creating a new popup
            if (!isOld) {
                left = left + 10;
            }
            popup.find('.popupHeaderArrow').css({
                'margin-left': '-10px'
            });
            popup.find('.popupHeader').css('width', '100%');

            var content = popup.find('.popupContent').css({
                'margin-left': '0',
                'padding': '5px 20px 5px 20px',
                'max-height': maxHeight - 40 + 'px'
            });

            popup.find('.olPopupContent').css({
                'width': '100%',
                'height': '100%'
            });

            var wrapper = content.find('.contentWrapper');
            popup.css({
                'height': 'auto',
                'width': 'auto',
                'min-width': '300px',
                'max-width': maxWidth + 'px',
                'min-height': '200px',
                'left': left + 'px',
                'position': 'absolute',
                'overflow': 'visible',
                'z-index': '16000'
            });

            var height = wrapper.height();
            height = height > maxHeight ? (maxHeight + 30) + 'px' : 'auto';
            var isOverThanMax = height > maxHeight;
            content.css({
                'height': height
            });

            if (!isOverThanMax) {
                popup.css('min-height', 'inherit');
            }
        },
        _adaptPopupSizeWithPositioning: function (olPopupId, isOld) {
            var size = this.getMapModule().getSize(),
                popup = jQuery('#' + olPopupId),
                maxWidth = size.width * 0.7,
                maxHeight = size.height * 0.7;
            popup.find('.popupHeader').css('width', '100%');

            popup.find('.popupContent').css({
                'margin-left': '0',
                'padding': '5px 20px 5px 20px',
                'max-height': maxHeight - 40 + 'px'
            });

            popup.find('.olPopupContent').css({
                'width': '100%',
                'height': '100%'
            });

            popup.css({
                'height': 'auto',
                // just have some initial width, other than auto, so that we don't get ridiculous widths with wide content
                'width': '1px',
                'min-width': '300px',
                'max-width': maxWidth + 'px',
                'overflow': 'visible',
                'z-index': '16000'
            });
        },
        /**
         * @method _panMapToShowPopup
         * @private
         * Pans map if gfi popup would be out of screen
         * @param {Array} lonlat where to show the popup
         */
        _panMapToShowPopup: function (lonlatArray, positioning, margins) {
            margins = margins || this._viewportMargins;
            // don't try to pan the map if gfi popup position isn't in the viewport (extended with isInViewport margin)
            if (!this.getMapModule().isLonLatInViewport(lonlatArray, margins.isInViewport)) {
                return;
            }

            var me = this,
                posClasses = me._positionClasses, // supported ol/OverlayPositioning
                pixels = me.getMapModule().getPixelFromCoordinate(lonlatArray),
                mapSize = me.getMapModule().getSize(),
                panY = 0,
                panX = 0,
                positionX = 'left', // default ('no-position-info')
                positionY = 'top', // default ('no-position-info')
                popup = jQuery('.olPopup'),
                popupX = popup.width(),
                popupY = popup.height();
            // WORKAROUND: pixels should be in the viewport.
            // if them aren't, then mapmove isn't ended before getPixelFromCoordinate called
            // and pixels aren't calculated correctly -> don't try to pan map
            var margin = margins.isInViewport / 2;
            if (pixels.y > mapSize.height + margin || pixels.y < -margin || pixels.x > mapSize.width + margin || pixels.x < -margin) {
                return;
            }

            // If supported ol/OverlayPositioning is used, use it instead of default values
            Object.keys(posClasses).forEach(function (pos) {
                if (positioning === posClasses[pos]) {
                    var popupDirection = positioning.split('-');
                    positionY = popupDirection[0];
                    positionX = popupDirection[1];
                }
            });
            // TODO: popupHeaderArrow and header sizes are not included
            // Check panY
            if (positionY === 'top') {
                if (pixels.y + popupY + margins.bottom > mapSize.height) {
                    panY = (pixels.y + popupY + margins.bottom) - mapSize.height;
                // check that we are not "over the top"
                } else if (pixels.y < margins.top) {
                    panY = pixels.y - margins.top;
                }
            } else if (positionY === 'center') {
                if (pixels.y + (popupY / 2) + margins.bottom > mapSize.height) {
                    panY = (pixels.y + popupY / 2 + margins.bottom) - mapSize.height;
                } else if (pixels.y - popupY / 2 - margins.top < 0) {
                    panY = pixels.y - popupY / 2 - margins.top;
                }
            } else if (positionY === 'bottom') {
                if (pixels.y - popupY - margins.top < 0) {
                    panY = pixels.y - popupY - margins.top;
                }
            }
            // Check panX
            if (positionX === 'left') {
                if (pixels.x + popupX + margins.right > mapSize.width) {
                    panX = (pixels.x + popupX + margins.right) - mapSize.width;
                }
            } else if (positionX === 'center') {
                if (pixels.x + popupX / 2 + margins.right > mapSize.width) {
                    panX = (pixels.x + popupX / 2 + margins.right) - mapSize.width;
                } else if (pixels.x - popupX / 2 - margins.left < 0) {
                    panX = pixels.x - popupX / 2 - margins.left;
                }
            } else if (positionX === 'right') {
                if (pixels.x - popupX - margins.left < 0) {
                    panX = pixels.x - popupX - margins.left;
                }
            }
            // Pan map if needed
            if (panX !== 0 || panY !== 0) {
                me.getMapModule().panMapByPixels(panX, panY);
            }
        },

        /**
         * Changes the colour scheme of the plugin
         *
         * @method changeColourScheme
         * @param {Object} colourScheme object containing the colour settings for the plugin
         *      {
         *          bgColour: <the background color of the gfi header>,
         *          titleColour: <the colour of the gfi title>,
         *          headerColour: <the colour of the feature name>,
         *          iconCls: <the icon class of the gfi close icon>
         *      }
         * @param {jQuery} div DOMElement
         * @param {String} id popup id
         */
        _changeColourScheme: function (colourScheme, div, id) {
            if (id) {
                div = div || jQuery('div#' + id);// || jQuery('.olPopup:visible');
            } else {
                // div = div || jQuery('.olPopup:visible');
            }
            if (!colourScheme || !div) {
                return;
            }

            var gfiHeaderArrow = div.find('div.popupHeaderArrow'),
                gfiHeader = div.find('div.popupHeader'),
                gfiTitle = div.find('div.popupTitle'),
                layerHeader = div.find('div.getinforesult_header'),
                featureHeader = div.find('h3.myplaces_header'),
                closeButton = div.find('div.olPopupCloseBox');

            /* top arrow needs to be the same color as the header, when it's pointing out of the header (bottom and no positioning (=default)) */
            if (jQuery(gfiHeaderArrow).hasClass('top-center')) {
                gfiHeaderArrow.css({
                    'border-bottom-color': colourScheme.bgColour
                });
            } else if (jQuery(gfiHeaderArrow).hasClass('no-position-info')) {
                gfiHeaderArrow.css({
                    'border-right-color': colourScheme.bgColour
                });
            }

            gfiHeader.css({
                'background-color': colourScheme.bgColour,
                'color': colourScheme.titleColour
            });

            gfiTitle.css({
                'color': colourScheme.titleColour
            });

            layerHeader.css({
                'background-color': colourScheme.bgColour
            });

            layerHeader.find('div.getinforesult_header_title').css({
                'color': colourScheme.titleColour
            });

            featureHeader.css({
                'color': colourScheme.headerColour
            });
            // AH-1075 colourScheme.iconCls might not be set, so check first.
            if (colourScheme.iconCls) {
                closeButton
                    .removeClass('icon-close-white icon-close')
                    .addClass(colourScheme.iconCls);
            }

            /* buttons and actionlinks */
            if (colourScheme) {
                if (colourScheme.linkColour) {
                    jQuery(div).find('span.infoboxActionLinks').find('a').css('color', colourScheme.linkColour);
                }
                if (colourScheme.buttonBgColour) {
                    jQuery(div).find('span.infoboxActionLinks').find('input:button').css('background', 'none');
                    jQuery(div).find('span.infoboxActionLinks').find('input:button').css('background-color', colourScheme.buttonBgColour);
                }
                if (colourScheme.buttonLabelColour) {
                    jQuery(div).find('span.infoboxActionLinks').find('input:button').css('color', colourScheme.buttonLabelColour);
                }
            }
        },
        _handleMapSizeChanges: function (width, height) {
            var me = this,
                pid,
                popup;
            for (pid in me._popups) {
                if (me._popups.hasOwnProperty(pid)) {
                    popup = this._popups[pid];
                    if (popup.isInMobileMode) {
                        // are we moving away from the mobile mode? -> close and rerender.
                        if (!me._isInMobileMode(popup.options.mobileBreakpoints)) {
                            popup.popup.close(true);
                            me._renderPopup(pid, popup.contentData, popup.title, popup.lonlat, popup.options, false, []);
                        }
                    } else {
                        // are we moving into the mobile mode? -> close old and rerender
                        if (me._isInMobileMode(popup.options.mobileBreakpoints)) {
                            me.close(pid);
                            me._renderPopup(pid, popup.contentData, popup.title, popup.lonlat, popup.options, false, []);
                        }
                    }
                }
            }
        },
        /**
         * Changes the font used by plugin by adding a CSS class to its DOM elements.
         *
         * @method _changeFont
         * @param {String} fontId
         * @param {jQuery} div DOMElement
         * @param {String} id popup id
         */
        _changeFont: function (fontId, div, id) {
            // We shouldn't need this anymore. The map element will receive a class that sets font.
            // However we should check if we have enabled RPC users to set font in a request...
            div = div || jQuery('div#' + id);

            if (!div || !fontId) {
                return;
            }

            // The elements where the font style should be applied to.
            var elements = [],
                j,
                el;

            elements.push(div);
            elements.push(div.find('table.getinforesult_table'));

            // Remove possible old font classes.
            for (j = 0; j < elements.length; j += 1) {
                el = elements[j];
                // FIXME create function outside the loop
                el.removeClass(function () {
                    var removeThese = '',
                        classNames = this.className.split(' '),
                        i;

                    // Check if there are any old font classes.
                    for (i = 0; i < classNames.length; i += 1) {
                        if (/oskari-theme-font-/.test(classNames[i])) {
                            removeThese += classNames[i] + ' ';
                        }
                    }

                    // Return the class names to be removed.
                    return removeThese;
                });

                // Add the new font as a CSS class.
                el.addClass('oskari-theme-font-' + fontId);
            }
        },

        /**
         * @method close
         * @param {String} id
         *      id for popup that we want to close (optional - if not given, closes all popups)
         */
        close: function (id, position) {
            // destroys all if id not given
            // deletes reference to the same id will work next time also
            var pid,
                popup,
                event,
                sandbox = this.getMapModule().getSandbox();
            if (!id) {
                for (pid in this._popups) {
                    if (this._popups.hasOwnProperty(pid)) {
                        popup = this._popups[pid];
                        if (!position ||
                            position.lon !== popup.lonlat.lon ||
                            position.lat !== popup.lonlat.lat) {
                            delete this._popups[pid];
                            if (typeof popup.popup.setPosition === 'function') {
                                popup.popup.setPosition(undefined);
                            }
                            if (popup.popup && popup.type === 'desktop') {
                                this.getMapModule().getMap().removeOverlay(popup.popup);
                            } else if (popup.popup && popup.type === 'mobile') {
                                popup.popup.close(true);
                            }
                        }
                    }
                }
                return;
            }

            // id specified, delete only single popup
            popup = this._popups[id];
            if (popup) {
                delete this._popups[id];
                if (popup.popup && popup.type === 'desktop') {
                    this.getMapModule().getMap().removeOverlay(popup.popup);
                } else if (popup.popup && popup.type === 'mobile') {
                    popup.popup.close();
                }
                event = Oskari.eventBuilder('InfoBox.InfoBoxEvent')(id, false);
                sandbox.notifyAll(event);
            }
            // else notify popup not found?
        },

        /**
         * @method getPopups
         * Returns references to popups that are currently open
         * @return {Object}
         */
        getPopups: function (id) {
            if (id) {
                return this._popups[id];
            }
            return this._popups;
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
