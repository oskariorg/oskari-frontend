import React from 'react';
import ReactDOM from 'react-dom';
import { LayerCollapse } from './LayerCollapse';
import { StateHandler } from './LayerCollapse/StateHandler';
import { LayerFilters } from './LayerFilters';
import { Button } from 'oskari-ui';
import styled from 'styled-components';

/**
 * @class Oskari.mapframework.bundle.layerselector2.view.LayersTab
 *
 *
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerselector2.view.LayersTab',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, title, id) {
        this.instance = instance;
        this.title = title;
        this.id = id;
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.layerGroups = [];
        this.layerContainers = {};
        this.layerlistService = Oskari.getSandbox().getService('Oskari.mapframework.service.LayerlistService');

        this.templates = {
            spinner: '<span class="spinner-text"></span>',
            shortDescription: '<div class="field-description"></div>',
            description: '<div>' +
                '  <h4 class="indicator-msg-popup"></h4>' +
                '  <p></p>' +
                '</div>',
            relatedKeywords: '<div class="related-keywords"></div>',
            keywordsTitle: '<div class="keywords-title"></div>',
            keywordContainer: '<a href="#"class="keyword-cont">' +
                '  <span class="keyword"></span>' +
                '</a>',
            keywordType: '<div class="type"></div>',
            layerListMountPoint: '<div class="layer-list-mount-pt"></div>',
            layerFiltersMountPoint: '<div class="layer-filters-mount-pt"></div>',
            layerWizardBtnMountPoint: '<div class="layer-wizard-btn-mount-pt"></div>'
        };
        this.layerCollapseStateHandler = new StateHandler();
        this.layerCollapseStateHandler.updateSelectedLayerIds();
        this.layerCollapseStateHandler.addListener(this._render.bind(this));
        this.layerlistService.on('Layerlist.Filter.Button.Add', () => this.renderLayerFilters());
        this.layerlistService.on('FilterActivate', () => this.renderLayerFilters());
        Oskari.on('app.start', () => this._addLayerWizardBtn());
        this._createUI(id);
    }, {

        getTitle: function () {
            return this.title;
        },

        getTabPanel: function () {
            return this.tabPanel;
        },

        getState: function () {
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
            };
            return state;
        },

        setState: function (state) {
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterLayers(state.filter);
            }
        },

        /**
         * @public @method focus
         * Focuses the panel's search field (if available)
         *
         *
         */
        focus: function () {
            this.getFilterField().getField().find('input').focus();
        },

        /**
         * @method _createInfoIcon
         * @private
         * @param {Object} input
         *      container for the icon
         * Creates info icon for given oskarifield
         */
        _createInfoIcon: function (oskarifield) {
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = oskarifield.find('.field-description');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show metadata
            infoIcon.on('click', function (e) {
                var desc = jQuery(me.templates.description),
                    dialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'
                    ),
                    okBtn = Oskari.clazz.create(
                        'Oskari.userinterface.component.buttons.OkButton'
                    );

                desc.find('p').text(me._locale.filter.description);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                });
                dialog.show(me._locale.filter.text, desc, [okBtn]);
            });
        },

        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function (oskarifieldId) {
            var me = this,
                oskarifield;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title, me.id);

            oskarifield = me.getFilterField().getField();

            if (me.showSearchSuggestions) {
                oskarifield.append(
                    jQuery(me.templates.spinner)
                        .text(me._locale.loading)
                );

                oskarifield.append(
                    jQuery(me.templates.relatedKeywords)
                );
            }

            oskarifield.append(
                jQuery(me.templates.shortDescription)
                    .text(me._locale.filter.shortDescription)
            );

            me._createInfoIcon(oskarifield);

            if (!(this.instance.conf && this.instance.conf.hideLayerFilters && this.instance.conf.hideLayerFilters === true)) {
                me.layerFiltersMountPoint = jQuery(me.templates.layerFiltersMountPoint);
                me.tabPanel.getContainer().append(me.layerFiltersMountPoint);
            }

            me.tabPanel.getContainer().append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            // add id to search input
            oskarifield.find('input').attr(
                'id',
                'oskari_layerselector2_search_input_tab_' + oskarifieldId
            );

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.layerListMountPoint = jQuery(me.templates.layerListMountPoint);
            me.tabPanel.getContainer().append(me.layerListMountPoint);
        },

        _addLayerWizardBtn: function () {
            if (Oskari.getSandbox().hasHandler('ShowLayerEditorRequest')) {
                const PositionedButton = styled(Button)`
                    position: absolute;
                    right: 40px;
                    top: 80px;
                    line-height: 0;
                `;
                const OpenLayerWizardButton = () => (
                    <PositionedButton
                        size="large"
                        onClick={() => Oskari.getSandbox().postRequestByName('ShowLayerEditorRequest', [])}
                        icon="plus"
                        title={this._locale.tooltip.addLayer} />
                );
                const layerWizardBtnMountPoint = jQuery(this.templates.layerWizardBtnMountPoint);
                this.tabPanel.getContainer().append(layerWizardBtnMountPoint);
                ReactDOM.render(<OpenLayerWizardButton/>, layerWizardBtnMountPoint[0]);
            }
        },

        /**
         * TODO. React here
         */
        _render: function (props) {
            if (!props) {
                this.layerCollapseStateHandler.updateStateWithProps({
                    groups: this.layerGroups,
                    filterKeyword: this.filterField.getValue()
                });
                return;
            }
            ReactDOM.render(<LayerCollapse {...props} locale={this._locale} />, this.layerListMountPoint[0]);
        },

        /**
         * Get filter field
         * @method  @public getFilterField
         *
         * @return {Oskari.userinterface.component.FormInput} field
         */
        getFilterField: function () {
            var me = this,
                field,
                timer = 0;
            if (me.filterField) {
                return me.filterField;
            }
            field = Oskari.clazz.create(
                'Oskari.userinterface.component.FormInput');
            field.setPlaceholder(me.instance.getLocalization('filter').text);
            field.addClearButton();
            field.bindChange(function (event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                var evt = event;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    me._fireFiltering(field.getValue(), evt, me);
                    timer = null;
                }, 300);
            }, true);

            me.filterField = field;
            return field;
        },

        /**
         * @method _fireFiltering
         * @private
         * @param {String} keyword
         *      User input
         * @param {Object} event
         *      Event that caused the action to fire
         * @param {Object} me
         *      Reference to the bundle instance
         * Calls all needed functions to do the layer filtering.
         */
        _fireFiltering: function (keyword, event, me) {
            // Filter by name
            me.filterLayers(keyword);

            if (me.showSearchSuggestions) {
                // User input has changed, clear suggestions
                me.clearRelatedKeywordsPopup(
                    keyword,
                    jQuery(event.currentTarget).parents('.oskarifield')
                );
                // get new suggestions if user input is long enough
                me._relatedKeywordsPopup(keyword, event, me);
            }
        },
        /**
        * @method _layerListComparator
        * Uses the private property #grouping to sort layer objects in the wanted order for rendering
        * The #grouping property is the method name that is called on layer objects.
        * If both layers have same group, they are ordered by layer.getName()
        * @private
        * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
        * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
        * @param {String} groupingMethod method name to sort by
        */
        _layerListComparator: function (a, b, groupingMethod) {
            var nameA = a[groupingMethod]().toLowerCase();
            var nameB = b[groupingMethod]().toLowerCase();
            if (nameA === nameB && (a.getName() && b.getName())) {
                nameA = a.getName().toLowerCase();
                nameB = b.getName().toLowerCase();
            }
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        },
        /**
         * Show layer groups
         * @method  @public showLayerGroups
         *
         * @param  {Array} groups
         */
        showLayerGroups: function (groups) {
            this.layerGroups = groups;
            this.filterLayers(this.filterField.getValue());
        },

        /**
         * @method filterLayers
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Array} ids optional list of layer IDs to be shown
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        filterLayers: function (keyword, ids) {
            let me = this;
            let visibleGroupCount = 0;
            let i;
            let n;
            let layer;
            let layerId;

            if (!ids && me.sentKeyword === keyword) {
                ids = me.ontologyLayers;
            }

            // filter
            for (i = 0; i < me.layerGroups.length; i += 1) {
                let group = me.layerGroups[i];
                let layers = group.getLayers();
                let visibleLayerCount = 0;
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    let bln = group.matchesKeyword(layerId, keyword) || (me.showSearchSuggestions && ids && me._arrayContains(ids, layerId));
                    if (bln) {
                        visibleLayerCount += 1;
                    }
                }
                if (visibleLayerCount > 0) {
                    visibleGroupCount += 1;
                }
                if (group.badge) {
                    group.badge.updateContent(visibleLayerCount + '/' + layers.length);
                }
            }

            // check if there are no groups visible -> show 'no matches' notification
            // else clear any previous message
            if (visibleGroupCount === 0) {
                // empty result
                // loc = me.instance.getLocalization('errors');
                // TODO show loc.noResults!
            } else {
                // me.accordion.removeMessage();
            }
            this._render();
        },

        /**
         * @method clearRelatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Object} oskarifield
         *      dom object to be cleared
         * Clears related keywords popup
         */
        clearRelatedKeywordsPopup: function (keyword, oskarifield) {
            // clear only if sent keyword has changed or it is not null
            if (this.sentKeyword && this.sentKeyword !== keyword) {
                oskarifield.find('.related-keywords').html('').hide();
            }
        },

        /**
         * @method _relatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Object} event
         *      event hat caused the function to fire
         * @param {Object} me
         *      reference to the bundle instance
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _relatedKeywordsPopup: function (keyword, event, me) {
            // event.preventDefault();
            var oskarifield = jQuery(event.currentTarget).parents('.oskarifield');
            var relatedKeywordsCont;
            var ajaxUrl;

            if (!keyword || keyword.length === 0) {
                this._showAllLayers();
                return;
            }
            if (keyword.length < 4) {
                // empty result
                oskarifield.find('.related-keywords').hide();
                return;
            }

            relatedKeywordsCont = oskarifield.find('.spinner-text').show();

            me.sentKeyword = keyword;

            ajaxUrl = Oskari.urls.getRoute('SearchKeywords') + '&keyword=';
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType(
                            'application/j-son;charset=UTF-8');
                    }
                },
                url: ajaxUrl + encodeURIComponent(keyword) + '&lang=' + Oskari.getLang(),
                success: function (pResp) {
                    me.relatedKeywords = pResp;
                    me._showRelatedKeywords(keyword, pResp, oskarifield);
                    relatedKeywordsCont.hide();
                },
                error: function (jqXHR, textStatus) {
                    var lctn = me.instance.getLocalization('errors');
                    me.accordion.showMessage(lctn.generic);
                    relatedKeywordsCont.hide();
                }
            });
        },

        /**
         * @method _arrayContaines
         * @private
         * @param {Array} arr
         *     Array to be checked
         * @param {String} val
         *     Value to be searched
         * FIXME IE8 isn't supported anymore, just use forEach or some
         * IE8 doesn't have Array.indexOf so we use this...
         */
        _arrayContains: function (arr, val) {
            var i;
            if (arr.indexOf) {
                return arr.indexOf(val) > -1;
            }
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        },

        /**
         * @method _concatNew
         * @private
         * @param {Array} arr1
         *     Array of previously concatenated values
         * @param {Array} arr2
         *     Array of values to be concatenated
         * Concatenates (in place) those values from arr2 to arr1 that are not present in arr1
         */
        _concatNew: function (arr1, arr2) {
            var me = this,
                i;

            for (i = arr2.length - 1; i >= 0; i -= 1) {
                if (!me._arrayContains(arr1, arr2[i])) {
                    arr1.push(arr2[i]);
                }
            }
        },

        /**
         * @method _isDefined
         * @private
         * @param value
         * Determines if the given value... has a value.
         */
        _isDefined: function (value) {
            return typeof value !== 'undefined' && value !== null && value !== '';
        },

        /**
         * @method _containsIgnoreCase
         * @private
         * @param {String} keyword
         * @param {String} match
         * Returns true if keyword contains match (ignoring case)
         */
        _containsIgnoreCase: function (keyword, match) {
            var me = this;
            return me._isDefined(keyword) && me._isDefined(match) && keyword.toLowerCase().indexOf(match.toLowerCase()) > -1;
        },

        /**
         * @method _matchesIgnoreCase
         * @private
         * @param {String} type1
         * @param {String} type2
         * Returns true if the given types match in lower case.
         * Also returns false if one or both types are not defined
         */
        _matchesIgnoreCase: function (type1, type2) {
            var me = this;
            return me._isDefined(type1) && me._isDefined(type2) && type1.toLowerCase() === type2.toLowerCase();
        },

        /**
         * @method _showRelatedKeywords
         * @private
         * @param {String} userInput User input
         * @param {Object} keywords
         *      related keywords to filter layers by
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _showRelatedKeywords: function (userInput, keywords, oskarifield) {
            var me = this;
            var relatedKeywordsCont = me.getFilterField().getField().find('.related-keywords');
            keywords = keywords || [];
            var keyword;
            var keywordTmpl;
            var ontologySuggestions = [];
            var ontologyLayers = [];

            me.clearRelatedKeywordsPopup(null, oskarifield);

            // Go through related keywords, get top 3, show only them
            keywords.forEach(function (keyword, index) {
                if (!keyword.layers || !keyword.layers.length) {
                    return;
                }
                // check if we want to show matching layers instead of a suggestion
                if (me._matchesIgnoreCase(keyword.type, 'syn') ||
                    (!me._isDefined(keyword.type) && me._containsIgnoreCase(keyword.keyword, userInput))) {
                    // copy keyword layerids to ontologyLayers, avoid duplicates just because
                    if (ontologyLayers.size === 0) {
                        ontologyLayers.concat(keyword.layers);
                    } else {
                        me._concatNew(ontologyLayers, keyword.layers);
                    }
                } else {
                    ontologySuggestions.push({
                        idx: index,
                        count: keyword.layers.length
                    });
                }
            });

            if (ontologySuggestions.length > 0) {
                relatedKeywordsCont.prepend(
                    jQuery(me.templates.keywordsTitle).text(
                        me._locale.filter.didYouMean
                    )
                );
            }

            // sort ontology suggestions by layer count
            ontologySuggestions.sort(function (x, y) {
                return x.count < y.count;
            });

            // show three top suggestions
            for (var i = 0; i < ontologySuggestions.length && i < 3; i += 1) {
                keyword = keywords[ontologySuggestions[i].idx];
                keywordTmpl = jQuery(me.templates.keywordContainer);
                keywordTmpl
                    .attr('data-id', keyword.id)
                    .attr('data-keyword', keyword.keyword)
                    .find('.keyword').text(
                        keyword.keyword.toLowerCase() + ' (' +
                        keyword.layers.length + ')'
                    );

                relatedKeywordsCont.append(keywordTmpl);
            }
            if (ontologySuggestions.length) {
                relatedKeywordsCont.show();
            }

            me.ontologyLayers = ontologyLayers;
            // Show ontologyLayers in accordion
            me.filterLayers(userInput, ontologyLayers);

            // when clicked -> filter layers
            relatedKeywordsCont.find('.keyword-cont').on(
                'click',
                function (event) {
                    var val = jQuery(event.currentTarget).attr('data-keyword');

                    me.getFilterField().setValue(val);
                    me._fireFiltering(val, event, me);
                }
            );
        },

        _showAllLayers: function () {
            console.warn('LayerTab._showAllLayers is deprecated');
        },

        setLayerSelected: function (layerId, isSelected) {
            this.layerCollapseStateHandler.updateSelectedLayerIds();
            this._render();
        },

        updateLayerContent: function (layerId, layer) {
            console.warn('LayerTab.updateLayerContent is deprecated');
        },

        renderLayerFilters: function () {
            ReactDOM.render(<LayerFilters filters = {this.layerlistService.getLayerlistFilterButtons()}
                service = {this.layerlistService.getMutator()}/>, this.layerFiltersMountPoint[0]);
        }
    }
);
