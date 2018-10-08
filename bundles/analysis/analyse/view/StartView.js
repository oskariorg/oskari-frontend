/**
 * @class Oskari.analysis.bundle.analyse.view.StartView
 * Starts analyse mode for users that are logged in.
 *  This is an initial screen for analyse methods and for user information
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.StartView',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     */

    function (instance, localization) {
        this.instance = instance;
        this.template = jQuery(
            '<div class="startview">' +
            '  <div class="content"></div>' +
            '  <div class="buttons"></div>' +
            '</div>'
        );
        this.templateError = jQuery(
            '<div class="error">' +
            '  <ul></ul>' +
            '</div>'
        );
        this.templateInfo = jQuery('<div class="icon-info"></div>');
        this.checkboxTemplate = jQuery(
            '<input type="checkbox" name="analyse_info_seen" id="analyse_info_seen" value="1">'
        );
        this.layerLabelTemplate = jQuery('<div class="analyse-startview-label"><label for="layersWithSelectedFeatures"></label></div>');
        this.layerList = jQuery(
            '<div class="analyse-featurelist" id="layersWithSelectedFeatures">' +
            '  <ul></ul>' +
            '</div>' +
            '</div>'
        );
        this.layerListRadioElement = jQuery(
            '<li>' +
            '  <label>' +
            '    <input name="layerListElement" type="radio" />' +
            '    <span></span>' +
            '  </label>' +
            '</li>'
        );
        this.labelTemplate = jQuery('<label for="analyse_info_seen"></label>');
        this.loc = localization;
        this.appendAlwaysCheckbox = true;
        this.content = undefined;
        this.buttons = {};
        this.emptySelectionsFromLayers;
        this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
        this.WFSLayerService = this.instance.sandbox.getService('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService');
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = this.template.clone();
            this.content = content;
            /*content.find('div.content').before(txt);*/
            container.append(content);

            this.alert.insertTo(container);

            this.alert.setContent(this.loc.text, 'default', true);

            //in analyse mode features can be selected only from one layer at once
            //check if user have selections from many layers and notify about it
            var selectionsInManyLayers = this.checkFeatureSelections();

            var continueButton = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            continueButton.addClass('primary');
            continueButton.setId('oskari_analysis_analyse_view_start_view_buttons_continue');
            continueButton.setTitle(this.loc.buttons['continue']);
            continueButton.setHandler(function () {
                if (selectionsInManyLayers) {
                    var selectedLayers = me.instance.sandbox.findAllSelectedMapLayers(),
                        removeSelectionsLayer;
                    _.forEach(me.emptySelectionsFromLayers, function (layerId) {
                        _.forEach(selectedLayers, function (layer) {
                            if (layer._id === layerId) {
                                removeSelectionsLayer = layer;
                                me.WFSLayerService.emptyWFSFeatureSelections(removeSelectionsLayer);
                            }
                        });
                    });
                }
                me.instance.setAnalyseMode(true);
            });
            this.buttons['continue'] = continueButton;
            continueButton.insertTo(content.find('div.buttons'));
            if (me.appendAlwaysCheckbox) {
                content.append('<br><br>');
                var checkbox = this.checkboxTemplate.clone(),
                    label = this.labelTemplate.clone();
                label.append(me.loc.infoseen.label);
                checkbox.on(
                    'change',
                    function () {
                        if (jQuery(this).prop('checked')) {
                            // Set cookie not to show analyse info again
                            jQuery.cookie(
                                'analyse_info_seen',
                                '1',
                                {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
                                'analyse_info_seen',
                                '0',
                                {
                                    expires: 1
                                }
                            );
                        }
                    }
                );
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }

            var cancelButton = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.CancelButton'
            );

            cancelButton.setId('oskari_analysis_analyse_view_start_view_buttons_cancel');
            cancelButton.setHandler(function () {
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });
            this.buttons.cancel = cancelButton;

            cancelButton.insertTo(content.find('div.buttons'));

        },

        checkFeatureSelections: function (container) {
            var me = this,
                WFSSelections = me.WFSLayerService.getWFSSelections(),
                layersWithFeatures = _.map(WFSSelections, 'layerId'),
                layerList = me.layerList.clone(),
                labelTemplate = me.layerLabelTemplate.clone(),
                layerListRadioElement,
                layerName;

            if (layersWithFeatures.length <= 1) {
                return false;
            } else {
                labelTemplate.find('label').append(me.loc.layersWithFeatures);
                layersWithFeatures.forEach(
                    function (layerId) {
                        layerName = me.getLayerName(layerId);
                        layerListRadioElement = me.layerListRadioElement.clone();
                        layerListRadioElement
                            .find('input')
                            .val(layerId);

                        layerListRadioElement
                            .find('span')
                            .html(layerName);

                        layerList.find('ul').append(layerListRadioElement);

                        if (layerList.find('input')[0].checked !== true) {
                            layerList.find('input').prop('checked', true);
                            layersWithFeatures = _.map(WFSSelections, 'layerId');
                            me.emptySelectionsFromLayers = _.pull(layersWithFeatures, layerId);
                        }
                    }
                );
                jQuery(layerList).find('input').on('click', function (el) {
                    var layerid = parseInt(el.currentTarget.value);
                    layersWithFeatures = _.map(WFSSelections, 'layerId');
                    me.emptySelectionsFromLayers = _.pull(layersWithFeatures, layerid);
                });
                me.content.find('div.content').append(labelTemplate);
                me.content.find('div.content').append(layerList);
                return true;
            }

        },

        getLayerName: function (layerId) {
            var layerId = layerId,
                layerName,
                layers;

            layers = this.instance.sandbox.findAllSelectedMapLayers();

            _.forEach(layers, function (layer) {
                if (layerId === layer._id) {
                    layerName = layer.getName();
                }
            })

            return layerName;

        }
    });