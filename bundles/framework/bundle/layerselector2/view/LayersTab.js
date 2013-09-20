/**
 * @class Oskari.mapframework.bundle.layerselector2.view.LayersTab
 *
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.layerselector2.view.LayersTab",

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance, title) {
        //"use strict";
        this.instance = instance;
        this.title = title;
        // TODO: maybe pass as param instead of digging through instance.conf?
        this.showSearchSuggestions = (instance.conf && instance.conf.showSearchSuggestions === true);
        this.layerGroups = [];
        this.layerContainers = {};
        this.templates = {
            'spinner': '<span class="spinner-text"></span>',
            'shortDescription': '<div class="field-description"></div>',
            'description': '<div><h4 class="indicator-msg-popup"></h4><p></p></div>',
            'relatedKeywords': '<div class="related-keywords"></div>',
            'keywordsTitle': '<div class="keywords-title"></div>',
            'keywordContainer': '<a href="#"class="keyword-cont"><span class="keyword"></span></a>',
            'keywordType': '<div class="type"></div>'
        };
        this._createUI();
    }, {
        getTitle: function () {
            //"use strict";
            return this.title;
        },
        getTabPanel: function () {
            //"use strict";
            return this.tabPanel;
        },
        getState: function () {
            //"use strict";
            var state = {
                tab: this.getTitle(),
                filter: this.filterField.getValue(),
                groups: []
            };
            // TODO: groups listing
            /*
        var layerGroups = jQuery(this.container).find('div.layerList div.layerGroup.open');
        for(var i=0; i < layerGroups.length; ++i) {
            var group = layerGroups[i];
            state.groups.push(jQuery(group).find('.groupName').text());
        }*/
            return state;
        },
        setState: function (state) {
            //"use strict";
            if (!state) {
                return;
            }

            if (!state.filter) {
                this.filterField.setValue(state.filter);
                this.filterLayers(state.filter);
            }
            /* TODO: should open panels in this.accordion where groups[i] == panel.title
            if (state.groups && state.groups.length > 0) {}
            */
        },

        /**
         * @method _createInfoIcon
         * @private
         * @param {Object} input
         *      container for the icon
         * Creates info icon for given oskarifield
         */
        _createInfoIcon: function (oskarifield) {
            //"use strict";
            var me = this,
                infoIcon = jQuery('<div class="icon-info"></div>'),
                indicatorCont = oskarifield.find('.field-description');
            // clear previous indicator
            indicatorCont.find('.icon-info').remove();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show metadata
            infoIcon.click(function (e) {
                var desc = jQuery(me.templates.description),
                    dialog = Oskari.clazz.create(
                        'Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create(
                        'Oskari.userinterface.component.Button');

                desc.find('p').text(me._locale.filter.description);
                okBtn.setTitle(me._locale.buttons.ok);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                });
                dialog.show(me._locale.filter.text, desc, [okBtn]);

            });
        },

        _createUI: function () {
            //"use strict";
            var me = this,
                oskarifield;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create(
                'Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.title);

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

            me.tabPanel.getContainer().append(oskarifield);
            oskarifield.find('.spinner-text').hide();

            me.accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion');
            me.accordion.insertTo(me.tabPanel.getContainer());
        },

        getFilterField: function () {
            //"use strict";
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
            //"use strict";
            // Filter by name
            me.filterLayers(keyword);
            
            if (me.showSearchSuggestions) {
                // User input has changed, clear suggestions
                me.clearRelatedKeywordsPopup(keyword, jQuery(event.currentTarget).parents(
                    '.oskarifield'));
                // get new suggestions if user input is long enough
                me._relatedKeywordsPopup(keyword, event, me);
            }
        },
        
        showLayerGroups: function (groups) {
            //"use strict";
            var me = this,
                i,
                group,
                layers,
                groupPanel,
                groupContainer,
                n,
                layer,
                layerWrapper,
                layerContainer,
                selectedLayers;

            me.accordion.removeAllPanels();
            me.layerContainers = undefined;
            me.layerContainers = {};
            me.layerGroups = groups;
            for (i = 0; i < groups.length; i += 1) {
                group = groups[i];
                layers = group.getLayers();
                groupPanel = Oskari.clazz.create(
                    'Oskari.userinterface.component.AccordionPanel');
                groupPanel.setTitle(group.getTitle() + ' (' + layers.length +
                    ')');
                group.layerListPanel = groupPanel;

                groupContainer = groupPanel.getContainer();
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerWrapper =
                        Oskari.clazz.create(
                            'Oskari.mapframework.bundle.layerselector2.view.Layer',
                            layer, me.instance.sandbox, me.instance.getLocalization()
                    );
                    layerContainer = layerWrapper.getContainer();
                    groupContainer.append(layerContainer);

                    me.layerContainers[layer.getId()] = layerWrapper;
                }
                me.accordion.addPanel(groupPanel);
            }

            selectedLayers = me.instance.sandbox.findAllSelectedMapLayers();
            for (i = 0; i < selectedLayers.length; i += 1) {
                me.setLayerSelected(selectedLayers[i].getId(), true);
            }

            me.filterLayers(me.filterField.getValue());
        },

        /**
         * @method _filterLayers
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * @param {Array} ids optional list of layer IDs to be shown
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        filterLayers: function (keyword, ids) {
            //"use strict";
            var me = this,
                visibleGroupCount = 0,
                visibleLayerCount,
                i,
                n,
                group,
                layer,
                layers,
                layerId,
                layerCont,
                bln,
                loc;

            if (!ids && me.sentKeyword === keyword) {
                ids = me.ontologyLayers;
            }
            // show all groups
            me.accordion.showPanels();
            if (!keyword || keyword.length === 0) {
                me._showAllLayers();
                return;
            }
            // filter
            for (i = 0; i < me.layerGroups.length; i += 1) {
                group = me.layerGroups[i];
                layers = group.getLayers();
                visibleLayerCount = 0;
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = me.layerContainers[layerId];
                    bln = group.matchesKeyword(layerId, keyword) || (me.showSearchSuggestions && ids && me._arrayContains(ids, layerId));
                    layerCont.setVisible(bln);
                    if (bln) {
                        visibleLayerCount += 1;
                        if (visibleLayerCount % 2 === 1) {
                            layerCont.getContainer().addClass('odd');
                        } else {
                            layerCont.getContainer().removeClass('odd');
                        }
                        // open the panel if matching layers
                        group.layerListPanel.open();
                    }
                }
                group.layerListPanel.setVisible(visibleLayerCount > 0);
                if (group.layerListPanel.isVisible()) {
                    visibleGroupCount += 1;
                }
                group.layerListPanel.setTitle(group.getTitle() + ' (' +
                    visibleLayerCount + '/' + layers.length + ')');
            }

            // check if there are no groups visible -> show 'no matches' notification
            // else clear any previous message
            if (visibleGroupCount === 0) {
                // empty result
                loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.noResults);
            } else {
                me.accordion.removeMessage();
            }
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
            //"use strict";
            // clear only if sent keyword has changed or it is not null
            if (this.sentKeyword && this.sentKeyword !== keyword) {
                oskarifield.find('.related-keywords').html("").hide();
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
            //"use strict";
            //event.preventDefault();
            var oskarifield = jQuery(event.currentTarget).parents(
                '.oskarifield'),
                loc,
                relatedKeywordsCont,
                ajaxUrl;

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

            ajaxUrl = this.instance.sandbox.getAjaxUrl();
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType(
                            "application/j-son;charset=UTF-8");
                    }
                },
                url: ajaxUrl + 'action_route=SearchKeywords&keyword=' + encodeURIComponent(keyword) + '&lang=' + Oskari
                    .getLang(),
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
            //"use strict";
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
            //"use strict";
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
            //"use strict";
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
            //"use strict";
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
            //"use strict";
            var me = this,
                relatedKeywordsCont = me.getFilterField().getField().find(
                    '.related-keywords'),
                i,
                keyword,
                keywordTmpl,
                ontologySuggestions = [],
                ontologyLayers = [];

            me.clearRelatedKeywordsPopup(null, oskarifield);

            // Go through related keywords, get top 3, show only them
            for (i = 0; i < keywords.length; i += 1) {
                keyword = keywords[i];
                if (keyword.layers.length > 0) {
                    // check if we want to show matching layers instead of a suggestion
                    if (me._matchesIgnoreCase(keyword.type, 'syn') || (!me._isDefined(
                        keyword.type) && me._containsIgnoreCase(
                        keyword.keyword, userInput))) {
                        // copy keyword layerids to ontologyLayers, avoid duplicates just because
                        if (ontologyLayers.size === 0) {
                            ontologyLayers.concat(keyword.layers);
                        } else {
                            me._concatNew(ontologyLayers, keyword.layers);
                        }
                    } else {
                        ontologySuggestions.push({
                            idx: i,
                            count: keyword.layers.length
                        });
                    }
                }
            }


            if (ontologySuggestions.length > 0) {
                relatedKeywordsCont.prepend(jQuery(me.templates.keywordsTitle).text(
                    me._locale.filter.didYouMean));
            } else {
                // Why show an error if we can't find suggestions?
                //relatedKeywordsCont.prepend(jQuery(me.templates.keywordsTitle).text(me._locale.errors.noResultsForKeyword));
            }

            // sort ontology suggestions by layer count
            ontologySuggestions.sort(function (x, y) {
                return x.count < y.count;
            });

            // show three top suggestions
            for (i = 0; i < ontologySuggestions.length && i < 3; i += 1) {
                keyword = keywords[ontologySuggestions[i].idx];
                keywordTmpl = jQuery(me.templates.keywordContainer);
                keywordTmpl
                    .attr('data-id', keyword.id)
                    .attr('data-keyword', keyword.keyword)
                    .find('.keyword').text(keyword.keyword.toLowerCase() + ' (' +
                        keyword.layers.length + ')');

                /* Disabled for now as the design document doesn't show these
                if (keyword.type) {
                    keywordType = jQuery(me.templates.keywordType);
                    keywordType.attr('title', me._locale.types[keyword.type]);
                    keywordTmpl.append(keywordType.text(keyword.type.toUpperCase()));
                }
                */

                relatedKeywordsCont.append(keywordTmpl);
            }
            if(ontologySuggestions.length) {
                relatedKeywordsCont.show();
            }

            me.ontologyLayers = ontologyLayers;
            // Show ontologyLayers in accordion
            me.filterLayers(userInput, ontologyLayers);

            // when clicked -> filter layers
            relatedKeywordsCont.find('.keyword-cont').on("click", function (
                event) {
                var val = jQuery(event.currentTarget).attr("data-keyword");
                me.getFilterField().setValue(val);
                me._fireFiltering(val, event, me);
            });
        },

        _showAllLayers: function () {
            //"use strict";
            var i,
                group,
                layers,
                n,
                layer,
                layerId,
                layerCont;

            for (i = 0; i < this.layerGroups.length; i += 1) {
                group = this.layerGroups[i];
                layers = group.getLayers();

                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = this.layerContainers[layerId];
                    layerCont.setVisible(true);
                    if (n % 2 === 1) {
                        layerCont.getContainer().addClass('odd');
                    } else {
                        layerCont.getContainer().removeClass('odd');
                    }
                }
                group.layerListPanel.setVisible(true);
                group.layerListPanel.close();
                group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length +
                    ')');
            }
        },
        setLayerSelected: function (layerId, isSelected) {
            //"use strict";
            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.setSelected(isSelected);
            }
        },
        updateLayerContent: function (layerId, layer) {
            //"use strict";
            var layerCont = this.layerContainers[layerId];
            if (layerCont) {
                layerCont.updateLayerContent(layer);
            }
        }
    });