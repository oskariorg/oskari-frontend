/**
 * @class Oskari.mapframework.bundle.printout.view.BasicPrintout
 * Renders the printouts "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.view.BasicPrintout',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.printout.PrintoutBundleInstance} instance
 *      reference to component that created this view
 * @param {Object} localization
 *      localization data in JSON format
 * @param {Object} backendConfiguration
 *      backend URL configuration for ajax and image requests
 * @param {Object} formState
 *      formState for ui state reload
 */
function(instance, localization, backendConfiguration) {
    var me = this;
    this.isEnabled = false;
    this.instance = instance;
    this.loc = localization;
    this.backendConfiguration = backendConfiguration;

    /* templates */
    this.template = {};
    for (p in this.__templates ) {
        this.template[p] = jQuery(this.__templates[p]);
    }

    /* page sizes listed in localisations */
    this.sizeOptions = this.loc.size.options;

    this.sizeOptionsMap = {};
    for (var s = 0; s < this.sizeOptions.length; s++) {
        this.sizeOptionsMap[this.sizeOptions[s].id] = this.sizeOptions[s];
    }

    /* format options listed in localisations */
    this.formatOptions = this.loc.format.options;
    this.formatOptionsMap = {};
    for (var f = 0; f < this.formatOptions.length; f++) {
        this.formatOptionsMap[this.formatOptions[f].id] = this.formatOptions[f];
    }

    /* content options listed in localisations */
    this.contentOptions = this.loc.content.options;
    this.contentOptionsMap = {};
    for (var f = 0; f < this.contentOptions.length; f++) {
        this.contentOptionsMap[this.contentOptions[f].id] = this.contentOptions[f];
    }

    /* legend options listed in localisations */
    this.legendOptions = this.loc.legend.options;
    this.legendOptionsMap = {};
    for (var f = 0; f < this.legendOptions.length; f++) {
        this.legendOptionsMap[this.legendOptions[f].id] = this.legendOptions[f];
    }

    this.accordion = null;
    this.mainPanel = null;

    this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

    this.previewContent = null;
    this.previewImgDiv = null;

    this.contentOptionDivs = {};

}, {
    __templates : {
        "preview" : '<div class="preview"><img /><span></span></div>',
        "previewNotes" : '<div class="previewNotes"><span></span></div>',
        "location" : '<div class="location"></div>',
        "tool" : '<div class="tool ">' + '<input type="checkbox"/>' + '<label></label></div>',
        "buttons" : '<div class="buttons"></div>',
        "help" : '<div class="help icon-info"></div>',
        "main" : '<div class="basic_printout">' + '<div class="header">' + '<div class="icon-close">' + '</div>' + '<h3></h3>' + '</div>' + '<div class="content">' + '</div>' + '<form method="post" target="map_popup_111" id="oskari_print_formID" style="display:none" action="" ><input name="geojson" type="hidden" value="" id="oskari_geojson"/></form>' + '</div>',
        "format" : '<div class="printout_format_cont printout_settings_cont"><div class="printout_format_label"></div></div>',
        "formatOptionTool" : '<div class="tool ">' + '<input type="radio" name="format" />' + '<label></label></div>',
        "legend" : '<div class="printout_legend_cont printout_settings_cont"><div class="printout_legend_label"></div></div>',
        "legendOptionTool" : '<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>',
        "title" : '<div class="printout_title_cont printout_settings_cont"><div class="printout_title_label"></div><input class="printout_title_field" type="text"></div>',
        "option" : '<div class="printout_option_cont printout_settings_cont">' + '<input type="checkbox" />' + '<label></label></div>',
        "sizeOptionTool" : '<div class="tool ">' + '<input type="radio" name="size" />' + '<label></label></div>'
    },
    /**
     * @method render
     * Renders view to given DOM element
     * @param {jQuery} container reference to DOM element this component will be
     * rendered to
     */
    render : function(container) {
        var me = this;
        var content = this.template.main.clone();

        this.mainPanel = content;
        content.find('div.header h3').append(this.loc.title);

        container.append(content);
        var contentDiv = content.find('div.content');

        this.alert.insertTo(contentDiv);

        var accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        this.accordion = accordion;

        var sizePanel = this._createSizePanel();
        sizePanel.open();

        accordion.addPanel(sizePanel);

        var settingsPanel = this._createSettingsPanel();
        accordion.addPanel(settingsPanel);

        var previewPanel = this._createPreviewPanel();
        previewPanel.open();

        accordion.addPanel(previewPanel);

        /*var scalePanel = this._createLocationAndScalePanel();
         scalePanel.open();

         accordion.addPanel(scalePanel);*/

        accordion.insertTo(contentDiv);

        // Legend setup visible only if statslayer is visible
        this._setLegendVisibility();

        // buttons
        // close
        container.find('div.header div.icon-close').bind('click', function() {
            me.instance.setPublishMode(false);
        });
        contentDiv.append(this._getButtons());

        var inputs = this.mainPanel.find('input[type=text]');
        inputs.focus(function() {
            me.instance.sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
        });
        inputs.blur(function() {
            me.instance.sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
        });
        // bind help tags
        var helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', this.instance.sandbox);
        helper.processHelpLinks(this.loc.help, content, this.loc.error.title, this.loc.error.nohelp);

    },
    /**
     * @method _createSizePanel
     * @private
     * Creates the size selection panel for printout
     * @return {jQuery} Returns the created panel
     */
    _createSizePanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.size.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.size.tooltip);
        contentPanel.append(tooltipCont);
        // content
        var closureMagic = function(tool) {
            return function() {
                var size = contentPanel.find('input[name=size]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.sizeOptions.length; ++i) {
                    me.sizeOptions[i].selected = false;
                }
                tool.selected = true;
                me._cleanMapPreview();
                me._updateMapPreview();
                // Update legend
                me._createLegend();
            };
        };
        for (var i = 0; i < this.sizeOptions.length; ++i) {
            var option = this.sizeOptions[i];
            var toolContainer = this.template.sizeOptionTool.clone();
            var label = option.label;
            if (option.width && option.height) {
                label = label + ' (' + option.width + ' x ' + option.height + 'px)';
            }
            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'printout_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            contentPanel.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.id,
                'name' : 'size',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }

        return panel;
    },
    /**
     * @method _createSettingsPanel
     * @private
     * Creates a settings panel for printout
     * @return {jQuery} Returns the created panel
     */
    _createSettingsPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.settings.label);
        var contentPanel = panel.getContainer();
        // tooltip
        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.settings.tooltip);
        contentPanel.append(tooltipCont);

        var closureMagic = function(tool) {
            return function() {
                var format = contentPanel.find('input[name=format]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.formatOptions.length; ++i) {
                    me.formatOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };
        /* format options from localisations files */
        var format = this.template.format.clone();
        format.find('.printout_format_label').html(this.loc.format.label);
        for (var i = 0; i < this.formatOptions.length; ++i) {
            var option = this.formatOptions[i];
            var toolContainer = this.template.formatOptionTool.clone();
            var label = option.label;

            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'printout_radiolabel'
            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            format.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.format,
                'name' : 'format',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic(option));
        }
        contentPanel.append(format);

        var mapTitle = this.template.title.clone();
        mapTitle.find('.printout_title_label').html(this.loc.mapTitle.label);
        mapTitle.find('.printout_title_field').attr({
            'value' : '',
            'placeholder' : this.loc.mapTitle.label
        });

        contentPanel.append(mapTitle);

        /* CONTENT options from localisations files */

        for (var f = 0; f < this.contentOptions.length; f++) {
            var dat = this.contentOptions[f];

            var opt = this.template.option.clone();
            opt.find('input').attr({
                'id' : dat.id,
                'checked' : dat.checked
            });
            opt.find('label').html(dat.label).attr({
                'for' : dat.id,
                'class' : 'printout_checklabel'
            });
            this.contentOptionDivs[dat.id] = opt;
            contentPanel.append(opt);

        }

        // Lengend options
        var closureMagic2 = function(tool) {
            return function() {
                var legend = contentPanel.find('input[name=legend]:checked').val();
                // reset previous setting
                for (var i = 0; i < me.legendOptions.length; ++i) {
                    me.legendOptions[i].selected = false;
                }
                tool.selected = true;

            };
        };

        var legend = this.template.legend.clone();
        legend.find('.printout_legend_label').html(this.loc.legend.label);
        for (var i = 0; i < this.legendOptions.length; ++i) {
            var option = this.legendOptions[i];
            var toolContainer = this.template.legendOptionTool.clone();
            var label = option.label;

            toolContainer.find('label').append(label).attr({
                'for' : option.id,
                'class' : 'printout_radiolabel'

            });
            if (option.selected) {
                toolContainer.find('input').attr('checked', 'checked');
            }
            legend.append(toolContainer);
            toolContainer.find('input').attr({
                'value' : option.loca,
                'name' : 'location',
                'id' : option.id
            });
            toolContainer.find('input').change(closureMagic2(option));
            toolContainer.find('input[name="location"]').click(function() {
                // Legend stuff
                me._createLegend();
            });
        }
        contentPanel.append(legend);

        return panel;
    },
    /**
     * @method _createSizePanel
     * @private
     * Creates the size selection panel for printout
     * @return {jQuery} Returns the created panel
     */
    _createPreviewPanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.preview.label);
        var contentPanel = panel.getContainer();

        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.preview.tooltip);
        contentPanel.append(tooltipCont);

        var previewContent = this.template.preview.clone();

        contentPanel.append(previewContent);

        /* progress */
        me.progressSpinner.insertTo(previewContent);

        var previewImgDiv = previewContent.find('img');
        previewImgDiv.click(function() {
            me.showFullScaleMapPreview();
        });
        var previewSpan = previewContent.find('span');

        this.previewContent = previewContent;
        this.previewImgDiv = previewImgDiv;
        this.previewSpan = previewSpan;

        for (var p in this.loc.preview.notes ) {
            var previewNotes = this.template.previewNotes.clone();
            previewNotes.find('span').text(this.loc.preview.notes[p]);
            contentPanel.append(previewNotes);
        }

        return panel;
    },
    /**
     * @method _createSizePanel
     * @private
     * Creates the size selection panel for printout
     * @return {jQuery} Returns the created panel
     */
    _createLocationAndScalePanel : function() {
        var me = this;
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(this.loc.location.label);
        var contentPanel = panel.getContainer();

        var tooltipCont = this.template.help.clone();
        tooltipCont.attr('title', this.loc.location.tooltip);
        contentPanel.append(tooltipCont);

        var locationContent = this.template.location.clone();

        contentPanel.append(locationContent);

        return panel;
    },
    _cleanMapPreview : function() {
        var loc = this.loc;
        var previewImgDiv = this.previewImgDiv, previewSpan = this.previewSpan;
        previewImgDiv.hide();
        previewSpan.text(loc.preview.pending);
    },
    _updateMapPreview : function() {
        var me = this;
        var selections = this._gatherSelections("image/png");

        //
        this.backendConfiguration = {
            "formatProducers" : {
                "application/pdf" : "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.pdf?",
                "image/png" : "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.png?"
            }
        };
        //

        var urlBase = this.backendConfiguration.formatProducers[selections.format];
        var maplinkArgs = selections.maplinkArgs;
        var pageSizeArgs = "&pageSize=" + selections.pageSize;
        var previewScaleArgs = "&scaledWidth=200"
        var url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

        this.previewContent.removeClass('preview-portrait');
        this.previewContent.removeClass('preview-landscape');
        this.previewContent.addClass(this.sizeOptionsMap[selections.pageSize].classForPreview);

        var previewImgDiv = this.previewImgDiv, previewSpan = this.previewSpan;

        me.progressSpinner.start();
        window.setTimeout(function() {
            previewImgDiv.imagesLoaded(function() {
                previewSpan.text('');
                previewImgDiv.fadeIn('slow', function() {
                    me.progressSpinner.stop();

                });
            });
            previewImgDiv.attr('src', url);

        }, 100);
    },
    showFullScaleMapPreview : function() {
        var selections = this._gatherSelections("image/png");
        var urlBase = this.backendConfiguration.formatProducers[selections.format];
        var maplinkArgs = selections.maplinkArgs;
        var pageSizeArgs = "&pageSize=" + selections.pageSize;
        var url = urlBase + maplinkArgs + pageSizeArgs;
        this.openURLinWindow(url, selections);

    },
    /**
     * @method _getButtons
     * @private
     * Renders printout buttons to DOM snippet and returns it.
     * @return {jQuery} container with buttons
     */
    _getButtons : function() {
        var me = this;

        var buttonCont = this.template.buttons.clone();

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle(this.loc.buttons.cancel);
        cancelBtn.setHandler(function() {
            me.instance.setPublishMode(false);
        });
        cancelBtn.insertTo(buttonCont);

        var saveBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        saveBtn.setTitle(this.loc.buttons.save);
        saveBtn.addClass('primary');
        saveBtn.setHandler(function() {
            var map = me.instance.sandbox.getMap();
            var features = ( typeof map.geojs === "undefined") ? null : map.geojs;

            var selections = me._gatherSelections();
            if (selections) {
                me._printMap(selections, features);
            }
        });
        saveBtn.insertTo(buttonCont);

        return buttonCont;
    },
    /**
     * @method _gatherSelections
     * @private
     * Gathers printout selections and returns them as JSON object
     * @return {Object}
     */
    _gatherSelections : function(format) {
        var container = this.mainPanel;
        var sandbox = this.instance.getSandbox();

        var size = container.find('input[name=size]:checked').val();
        var selectedFormat = (format != null) ? format : container.find('input[name=format]:checked').val();
        var title = container.find('.printout_title_field').val();

        var maplinkArgs = sandbox.generateMapLinkParameters();

        var selections = {
            pageTitle : title,
            pageSize : size,
            maplinkArgs : maplinkArgs,
            format : selectedFormat || "application/pdf"
        };

        for (var p in this.contentOptionsMap ) {
            selections[p] = this.contentOptionDivs[p].find('input').prop('checked');
        }

        return selections;

    },
    openURLinWindow : function(infoUrl, selections) {
        var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
        if (this._isLandscape(selections))
            wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=1200," + "height=850";
        var link = infoUrl;
        window.open(link, "BasicPrintout", wopParm);
    },
    /**
     * @method openPostURLinWindow
     * @private
     * Sends the gathered map data to the server to save them/publish the map.
     * @param {Object} printMap oskari map
     * @param {Object} printUrl Url to print service action route GetPreview
     * @param {Object} selections map data as returned by _gatherSelections()
     */
    openPostURLinWindow : function(printMap, printUrl, selections) {
        var me = this;
        var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
        if (this._isLandscape(selections))
            wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=1200," + "height=850";
        var link = printUrl;
        me.mainPanel.find('#oskari_print_formID').attr('action', link);
        me.mainPanel.find('input[name=geojson]').val(jQuery.base64.encode(this._getGeoJson(printMap)));
        window.open('about:blank', 'map_popup_111', wopParm);
        me.mainPanel.find('#oskari_print_formID').submit();

    },
    /**
     * @method _printMap
     * @private
     * Sends the gathered map data to the server to save them/publish the map.
     * @param {Object} selections map data as returned by _gatherSelections()
     * @param {Object} features map data as returned by _gatherFeatures()
     */
    _printMap : function(selections, features) {
        var me = this;
        var sandbox = this.instance.getSandbox();
        var url = sandbox.getAjaxUrl();

        var urlBase = this.backendConfiguration.formatProducers[selections.format];

        var maplinkArgs = selections.maplinkArgs;
        var pageSizeArgs = "&pageSize=" + selections.pageSize;
        var pageTitleArgs = "&pageTitle=" + selections.pageTitle;

        var contentOptions = [];
        for (var p in this.contentOptionsMap ) {
            if (selections[p]) {
                contentOptions.push("&" + p + "=true");
            }

        }
        var contentOptionArgs = contentOptions.join('');
        var formatArgs = "&format=" + selections.format;

        var parameters = maplinkArgs + '&action_route=GetPreview' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs;
        url = url + parameters;

        var printMap = this.instance.getSandbox().getMap();

        if (printMap.GeoJSON) {

            this.instance.getSandbox().printDebug("PRINT POST URL " + url);

            this.openPostURLinWindow(printMap, url, selections);

        } else {

            this.instance.getSandbox().printDebug("PRINT URL " + url);

            this.openURLinWindow(url, selections);

        }

    },
    /**
     * @method _isLandscape
     * @private
     * @param {Object} JSONobject (_gatherSelections)
     @return true/false
     * return true, if Landscape print orientation
     */
    _isLandscape : function(selections) {

        if (this.sizeOptionsMap[selections.pageSize].id.indexOf('Land') > -1) {
            return true;
        }
        return false;
    },
    /**
     * @method _getGeoJson
     * Get auxiliary graphics in geojson format + styles
     * @private
     * @
     * @return String  (Json stringify)
     * return null, if no geojson graphics
     */
    _getGeoJson : function(printMap) {

        if (printMap.GeoJSON) {
            var sgeojs = JSON.stringify(printMap.GeoJSON);
            sgeojs.replace('\"', '"');
            return sgeojs;
        }
        return null;
    },
    /**
     * @method _setLegendVisibility
     * Legend parameters UI visible on/off
     *
     * @private
     *
     */
    _setLegendVisibility : function() {
        var container = this.mainPanel;

        if (this._hasStatsLayers())
            container.find('.printout_legend_cont').show();
        else
            container.find('.printout_legend_cont').hide();
    },
    /**
     * @method _hasStatsLayers
     * Check if stats layers are selected
     *
     * @private
     * @return{boolean} true; statslayers exists
     *
     */
    _hasStatsLayers : function() {
        var layers = this.instance.getSandbox().findAllSelectedMapLayers();

        // request updates for map tiles
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].isLayerOfType('STATS')) {
                if (layers[i].isVisible())
                    return true;

            }
        }
        return false;
    },
    /**
     * @method _createLegend
     * Creates geojson legend for print service
     * Only for statslayer and statsgrid legend
     * @private
     * @
     *
     */
    _createLegend : function() {
        var me = this;
        // only if any statslayer visible 
        me._setLegendVisibility();
        if(!me._hasStatsLayers()) return;
        
        // Is geostat legend available
        // get div where the map is rendered from openlayers
        var map = this.instance.sandbox.getMap();
        var container = this.mainPanel;
        var parentContainer = jQuery('#contentMap');
        // Get legend position
        var legend_pos = container.find('input[name=location]:checked').val();
        if (legend_pos == 'NO') {
            // remove old, if any
            if (me.instance.getSandbox().getMap().GeoJSON)
                me.instance.getSandbox().getMap().GeoJSON = null;
            me.instance.legendPlugin.clearLegendLayers();
        } else {
            var legend = parentContainer.find('div.geostats-legend');
            if (legend.length > 0) {

                this._printMapInfo(legend, function(data) {

                    var title = legend.find('.geostats-legend-title').html();
                    // ranges
                    var ranges = [];
                    // loop divs
                    legend.find('div').each(function() {
                        var myclass = jQuery(this).attr('class');
                        if (myclass == undefined) {
                            var legend_row = {
                                "boxcolor" : jQuery(this).find('.geostats-legend-block').attr('style'),
                                "range" : jQuery(this).text()
                            }
                            ranges.push(legend_row);
                        }
                    });

                    var legendgjs = me.instance.legendPlugin.plotLegend(title, ranges, data, legend_pos);
                    me.instance.getSandbox().getMap().GeoJSON = legendgjs;
                })
            }
        }

    },
    /**
     * @method _printMapInfo
     *  Get print info data
     * @param {String} url  print url string
     * @private
     * @
     */
    _printMapInfo : function(legend, callback) {

        var me = this;
        var selections = me._gatherSelections();
        var sandbox = this.instance.getSandbox();
        var url = sandbox.getAjaxUrl();

        var urlBase = this.backendConfiguration.formatProducers[selections.format];

        var maplinkArgs = selections.maplinkArgs;
        var pageSizeArgs = "&pageSize=" + selections.pageSize;
        var pageTitleArgs = "&pageTitle=" + selections.pageTitle;

        var contentOptions = [];
        for (var p in this.contentOptionsMap ) {
            if (selections[p]) {
                contentOptions.push("&" + p + "=true");
            }

        }
        var contentOptionArgs = contentOptions.join('');
        var formatArgs = "&format=" + selections.format;

        var parameters = maplinkArgs + '&action_route=GetProxyRequest&url_id=1' + pageSizeArgs + pageTitleArgs + contentOptionArgs + formatArgs;
        url = url + parameters;

        // ajax call
        me.instance.printService.fetchPrintMapData(
        // url
        url,
        // success callback
        function(data) {
            if (data) {

                callback(data);
            } else {
                alert('Error to fetch print info: ');
            }
        },
        // error callback
        function(jqXHR, textStatus) {
            alert('Error to fetch print info: ');

        });
    },
    /**
     * @method destroy
     * Destroyes/removes this view from the screen.
     */
    destroy : function() {
        this.mainPanel.remove();
    },
    hide : function() {
        this.mainPanel.hide();
    },
    show : function() {
        this.mainPanel.show();
    },
    setEnabled : function(e) {
        this.isEnabled = e;
    },
    getEnabled : function() {
        return this.isEnabled;
    },
    refresh : function(isUpdate) {
        if (isUpdate) {
            this._updateMapPreview();
        } else {
            this._cleanMapPreview();
        }
        // Update legend
        this._createLegend();
    },
    getState : function() {
        return this._gatherSelections();
    },
    setState : function(formState) {

    }
});
