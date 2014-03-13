// Define outerHtml method for jQuery since we need to give openlayers plain html
// http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
// Elements outerHtml property only works on IE and chrome
jQuery.fn.outerHTML = function (arg) {
    var ret;

    // If no items in the collection, return
    if (!this.length) {
        return val === undefined || val === null ? this : null;
    }
    // Getter overload (no argument passed)
    if (!arg) {
        return this[0].outerHTML || (ret = this.wrap('<div>').parent().html(), this.unwrap(), ret);
    }
    // Setter overload
    jQuery.each(this, function (i, el) {
        var fnRet,
            pass = el,
            inOrOut = el.outerHTML ? "outerHTML" : "innerHTML";

        if (!el.outerHTML) {
            el = jQuery(el).wrap('<div>').parent()[0];
        }

        if (jQuery.isFunction(arg)) {
            if ((fnRet = arg.call(pass, i, el[inOrOut])) !== false)
                el[inOrOut] = fnRet;
        } else {
            el[inOrOut] = arg;
        }

        if (!el.outerHTML) {
            jQuery(el).children().unwrap();
        }
    });

    return this;
};

/**
 * @class Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin
 *
 * Extends jquery by defining outerHtml() method for it. (TODO: check if we really want to do it here).
 * Provides a customized popup functionality for Openlayers map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.infobox.plugin.mapmodule.OpenlayersPopupPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._popups = {};
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'OpenLayersPopupPlugin',

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this._map = mapModule.getMap();
            this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * @method init
         * implements Module protocol init method - declares popup templates
         */
        init: function () {
            var me = this;

            // templates
            this._arrow = jQuery('<div class="popupHeaderArrow"></div>');
            this._header = jQuery('<div></div>');
            this._headerWrapper = jQuery('<div class="popupHeader"></div>');
            this._headerCloseButton = jQuery('<div class="olPopupCloseBox icon-close-white" style="position: absolute; top: 12px;"></div>');
            this._contentDiv = jQuery('<div class="popupContent"></div>');
            this._contentWrapper = jQuery('<div class="contentWrapper"></div>');
            this._actionLink = jQuery('<span class="infoboxActionLinks"><a href="#"></a></span>');
            this._actionButton = jQuery('<span class="infoboxActionLinks"><input type="button" /></span>');
            this._contentSeparator = jQuery('<div class="infoboxLine">separator</div>');
        },

        /**
         * @method popup
         * @param {String} id
         *      id for popup so we can use additional requests to control it
         * @param {String} title
         *      popup title
         * @param {Object[]} contentData
         *      JSON presentation for the popup data
         * @param {OpenLayers.LonLat} lonlat
         *      coordinates where to show the popup
         * @param {Object} colourScheme
         *      the colour scheme for the popup (optional, uses the default colour scheme if not provided)
         * @param {String} font
         *      the font for the popup (optional, uses the default font if not provided)
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
        popup: function (id, title, contentData, lonlat, colourScheme, font) {
            if (_.isEmpty(contentData)) return;

            var me = this,
                currPopup = this._popups[id],
                refresh = (currPopup &&
                    currPopup.lonlat.lon === lonlat.lon &&
                    currPopup.lonlat.lat === lonlat.lat);

            if (refresh) {
                contentData = this._getChangedContentData(
                    currPopup.contentData.slice(), contentData.slice());
                currPopup.contentData = contentData;
            }

            this._renderPopup(id, contentData, title, refresh, lonlat, colourScheme, font);
        },
        _renderPopup: function(id, contentData, title, refresh, lonlat, colourScheme, font) {
            var contentDiv = this._renderContentData(contentData),
                popupContent = this._renderPopupContent(title, contentDiv),
                popup;

            if (refresh) {
                popup = this._popups[id].popup;
                popup.setContentHTML(popupContent);
            } else {
                popup = new OpenLayers.Popup(
                    id,
                    lonlat,
                    new OpenLayers.Size(400, 300),
                    popupContent,
                    false
                );
                this._popups[id] = {
                    title: title,
                    contentData: contentData,
                    lonlat: lonlat,
                    popup: popup
                };

                popup.moveTo = function (px) {
                    if ((px !== null && px !== undefined) && (this.div !== null && this.div !== undefined)) {
                        this.div.style.left = px.x + "px";
                        var topy = px.y - 20;
                        this.div.style.top = topy + "px";
                    }
                };

                this.getMapModule().getMap().addPopup(popup);
                this._panMapToShowPopup(lonlat);

                var popupDOM = jQuery('#' + id);
                // Set the colour scheme if one provided
                if (colourScheme) {
                    this._changeColourScheme(colourScheme, popupDOM, id);
                }
                // Set the font if one provided
                if (font) {
                    this._changeFont(font, popupDOM, id);
                }
            }

            if (this.adaptable) {
                this._adaptPopupSize(id, refresh);
            }

            this._setClickEvent(id, popup, contentData);

            popup.setBackgroundColor('transparent');
            jQuery(popup.div).css('overflow', 'visible');
            jQuery(popup.groupDiv).css('overflow', 'visible');
            // Fix the HTML5 placeholder for < IE10
            var inputs = jQuery('#' + id).find('.contentWrapper input, .contentWrapper textarea');
            if (typeof inputs.placeholder === 'function') {
                inputs.placeholder();
            }
        },
        _renderPopupContent: function(title, contentDiv) {
            var arrow = this._arrow.clone(),
                header = this._header.clone(),
                headerWrapper = this._headerWrapper.clone(),
                closeButton = this._headerCloseButton.clone(),
                resultHtml;

            header.append(title);
            headerWrapper.append(header);
            headerWrapper.append(closeButton);
            resultHtml = arrow.outerHTML() +
                headerWrapper.outerHTML() +
                contentDiv.outerHTML();

            return resultHtml;
        },
        _renderContentData: function(contentData) {
            var me = this;

            return _.foldl(contentData, function(contentDiv, datum, index) {
                var useButtons = (datum.useButtons === true),
                    primaryButton = datum.primaryButton,
                    contentWrapper = me._contentWrapper.clone();

                contentWrapper.append(datum.html);

                for (var key in datum.actions) {
                    var actionLink, btn, link;

                    if (useButtons) {
                        actionLink = me._actionButton.clone();
                        btn = actionLink.find('input');
                        btn.attr({
                            "contentdata": index,
                            "value": key
                        });
                        if (key == primaryButton) btn.addClass('primary');
                    } else {
                        actionLink = me._actionLink.clone();
                        link = actionLink.find('a');
                        link.attr('contentdata', index);
                        link.append(key);
                    }
                    contentWrapper.append(actionLink);
                }

                contentDiv.append(contentWrapper);
                return contentDiv;
            }, me._contentDiv.clone());
        },
        _setClickEvent: function(id, popup, contentData) {
            var me = this;
            // override
            popup.events.un({
                "click": popup.onclick,
                scope: popup
            });

            popup.events.on({
                "click": function (evt) {
                    var link = jQuery(evt.target || evt.srcElement);

                    if (link.hasClass('olPopupCloseBox')) { // Close button
                        me.close(id);
                    } else { // Action links
                        var i = link.attr('contentdata');
                        var text = link.attr('value');
                        if (!text) {
                            text = link.html();
                        }
                        if (contentData[i] && contentData[i].actions && contentData[i].actions[text]) {
                            contentData[i].actions[text]();
                        }
                    }
                },
                scope: popup
            });
        },
        _getChangedContentData: function(oldData, newData) {
            var retData;

            for (var i = 0, oLen = oldData.length; i < oLen; ++i) {
                for (var j = 0, nLen = newData.length; j < nLen; ++j) {
                    if (newData[j].layerId &&
                        newData[j].layerId === oldData[i].layerId) {
                        oldData[i] = newData[j];
                        newData.splice(j, 1);
                        break;
                    }
                }
            }

            retData = oldData.concat(newData);

            return retData;
        },
        removeContentData: function(popupId, contentId) {
            var popup = this.getPopups(popupId),
                removed = false,
                contentData, datum, i;

            if (!popup) return;

            contentData = popup.contentData;

            for (i = 0, cLen = contentData.length; i < cLen; ++i) {
                datum = contentData[i];
                if (datum.layerId && (''+datum.layerId === ''+contentId)) {
                    contentData.splice(i, 1);
                    removed = true;
                    break;
                }
            }

            if (removed) {
                this._renderPopup(popupId, contentData, popup.title, true);
            }
        },
        setAdaptable: function (isAdaptable) {
            this.adaptable = isAdaptable;
        },

        _adaptPopupSize: function (olPopupId, isOld) {
            var viewport = jQuery(this.getMapModule().getMapViewPortDiv());
            var popup = jQuery('#' + olPopupId);
            var left = parseFloat(popup.css('left'));
            // popup needs to move 10 pixels to the right
            // so that header arrow can be moved out of container(left).
            // Only move it if creating a new popup
            if (!isOld) left = left + 10;

            popup.find('.popupHeaderArrow').css({
                'margin-left': '-10px'
            });
            var header = popup.find('.popupHeader').css('width', '100%');
            var content = popup.find('.popupContent').css({
                'margin-left': '0',
                'padding': '5px 20px 5px 20px'
            });

            popup.find('.olPopupContent').css({
                'width': '100%',
                'height': '100%'
            });

            var maxWidth = viewport.width() * 0.7;
            var maxHeight = viewport.height() * 0.7;
            var wrapper = content.find('.contentWrapper');
            popup.css({
                'height': 'auto',
                'width': 'auto',
                'min-width': '256px',
                'max-width': maxWidth + 'px',
                'min-height': '200px',
                'max-height': maxHeight + 'px',
                'left': left + 'px',
                'z-index': '16000'
            });
            if (jQuery.browser.msie) {
                // allow scrolls to appear in IE, but not in any other browser
                // instead add some padding to the wrapper to make it look better
                wrapper.css({
                    'padding-bottom': '5px'
                });
            } else {
                var height = wrapper.height();
                height = height > maxHeight ? (maxHeight + 30) + 'px' : 'auto';
                content.css({
                    'height': height
                });
            }

            //        popup.css({'height': 'auto', 'width': 'auto', 'min-width': '200px', 'left': left+'px'});

        },

        /**
         * @method _panMapToShowPopup
         * @private
         * Pans map if gfi popup would be out of screen
         * @param {OpenLayers.LonLat} lonlat where to show the popup
         */
        _panMapToShowPopup: function (lonlat) {
            var pixels = this._map.getViewPortPxFromLonLat(lonlat);
            var size = this._map.getCurrentSize();
            var width = size.w;
            var height = size.h;
            // if infobox would be out of screen 
            // -> move map to make infobox visible on screen
            var panx = 0;
            var pany = 0;
            var popup = jQuery('.olPopup');
            var infoboxWidth = popup.width() + 50; //450;
            var infoboxHeight = popup.height() + 90; //300; 
            if (pixels.x + infoboxWidth > width) {
                panx = width - (pixels.x + infoboxWidth);
            }
            if (pixels.y + infoboxHeight > height) {
                pany = height - (pixels.y + infoboxHeight);
            }
            // check that we are not "over the top"
            else if (pixels.y < 25) {
                pany = 25;
            }
            if (panx !== 0 || pany !== 0) {
                this.getMapModule().panMapByPixels(-panx, -pany);
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
            div = div || jQuery('div#' + id);

            if (!colourScheme || !div) return;

            var gfiHeaderArrow = div.find('div.popupHeaderArrow'),
                gfiHeader = div.find('div.popupHeader'),
                gfiTitle = div.find('div.popupTitle'),
                layerHeader = div.find('div.getinforesult_header'),
                featureHeader = div.find('h3.myplaces_header'),
                closeButton = div.find('div.olPopupCloseBox');

            gfiHeaderArrow.css({
                'border-right-color': colourScheme.bgColour
            });

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
            div = div || jQuery('div#' + id);

            if (!div || !fontId) return;

            // The elements where the font style should be applied to.
            var elements = [];
            elements.push(div);
            elements.push(div.find('table.getinforesult_table'));

            // Remove possible old font classes.
            for (var j = 0; j < elements.length; j++) {
                var el = elements[j];

                el.removeClass(function () {
                    var removeThese = '',
                        classNames = this.className.split(' ');

                    // Check if there are any old font classes.
                    for (var i = 0; i < classNames.length; ++i) {
                        if (/oskari-publisher-font-/.test(classNames[i])) {
                            removeThese += classNames[i] + ' ';
                        }
                    }

                    // Return the class names to be removed.
                    return removeThese;
                });

                // Add the new font as a CSS class.
                el.addClass('oskari-publisher-font-' + fontId);
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
            if (!id) {
                for (var pid in this._popups) {
                    var popup = this._popups[pid];
                    if (!position ||
                        position.lon !== popup.lonlat.lon ||
                        position.lat !== popup.lonlat.lat) {
                        popup.popup.destroy();
                        delete this._popups[pid];
                    }
                }
                return;
            }
            // id specified, delete only single popup
            if (this._popups[id]) {
                if (this._popups[id].popup) {
                    this._popups[id].popup.destroy();
                }
                delete this._popups[id];
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
        },

        /**
         * @method register
         * mapmodule.Plugin protocol method - does nothing atm
         */
        register: function () {

        },
        /**
         * @method unregister
         * mapmodule.Plugin protocol method - does nothing atm
         */
        unregister: function () {},
        /**
         * @method startPlugin
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            sandbox.register(this);

        },
        /**
         * @method stopPlugin
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox
         */
        stopPlugin: function (sandbox) {

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Module protocol method - does nothing atm
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Module protocol method - does nothing atm
         */
        stop: function (sandbox) {}
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });