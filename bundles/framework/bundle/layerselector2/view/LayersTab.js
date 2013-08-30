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
        this.layerGroups = [];
        this.layerContainers = {};
        this.templates = {
            'shortDescription': '<div class="field-description"></div>',
            'description': '<div><h4 class="indicator-msg-popup"></h4><p></p></div>',
            'relatedKeywords': '<div class="related-keywords"></div>',
            'keywordsTitle': '<div class="keywords-title"></div>',
            'keywordContainer': '<div class="keyword-cont"><div class="keyword"></div></div>',
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
        _createUI: function () {
            //"use strict";
            this._locale = this.instance._localization;

            this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            this.tabPanel.setTitle(this.title);

            var oskarifield = this.getFilterField().getField();
            oskarifield.append(
                jQuery(this.templates.shortDescription)
                    .text(this._locale.filter.shortDescription)
            );
            this._createInfoIcon(oskarifield);

            this.tabPanel.getContainer().append(oskarifield);

            this.accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
            this.accordion.insertTo(this.tabPanel.getContainer());
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
            // show meta data
            infoIcon.click(function (e) {
                var desc = jQuery(me.templates.description),
                    dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                    okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

                desc.find('p').text(me._locale.filter.description);
                okBtn.setTitle(me._locale.buttons.ok);
                okBtn.addClass('primary');
                okBtn.setHandler(function () {
                    dialog.close(true);
                });
                dialog.show(me._locale.filter.text, desc, [okBtn]);

            });
        },
        getFilterField: function () {
            //"use strict";
            if (this.filterField) {
                return this.filterField;
            }
            var me = this,
                field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
            field.setPlaceholder(this.instance.getLocalization('filter').text);
            field.addClearButton();

            field.bindChange(function (event) {
                event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
                // up = 38, down= 40, enter= 13
                if (event.which &&
                        event.which !== 38 &&
                        event.which !== 40 &&
                        event.which !== 13) {

                    me.filterLayers(field.getValue());
                    //if user types more characters we need to hide the related keywords popup
                    me.clearRelatedKeywordsPopup(field.getValue(), jQuery(event.currentTarget).parents('.oskarifield'));
                }
            }, true);

            //pressing enter key fetches related keywords
            field.bindEnterKey(function (event) {
                me._relatedKeywordsPopup(field.getValue(), event, me);
            });

            // clear related keywords if focus moves.
            field.bindOnBlur(function () {
                this.relatedKeywords = null;
                var oskarifield = jQuery(field.getField()[0]);
                oskarifield.find('input').off("keydown");
                //FIXME            oskarifield.find('.related-keywords').remove();
            });

            this.filterField = field;
            return field;
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
                groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
                group.layerListPanel = groupPanel;

                groupContainer = groupPanel.getContainer();
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerWrapper =
                        Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                            layer, this.instance.sandbox, this.instance.getLocalization());
                    layerContainer = layerWrapper.getContainer();
                    groupContainer.append(layerContainer);

                    this.layerContainers[layer.getId()] = layerWrapper;
                }
                this.accordion.addPanel(groupPanel);
            }

            selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
            for (i = 0; i < selectedLayers.length; i += 1) {
                this.setLayerSelected(selectedLayers[i].getId(), true);
            }

            this.filterLayers(this.filterField.getValue());
        },
        /**
         * @method _filterLayers
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        filterLayers: function (keyword) {
            //"use strict";
            var visibleGroupCount = 0,
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
            // show all groups
            this.accordion.showPanels();
            if (!keyword || keyword.length === 0) {
                this._showAllLayers();
                return;
            }
            // filter
            for (i = 0; i < this.layerGroups.length; i += 1) {
                group = this.layerGroups[i];
                layers = group.getLayers();
                visibleLayerCount = 0;
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = this.layerContainers[layerId];
                    bln = group.matchesKeyword(layerId, keyword);
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
                group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount + '/' + layers.length + ')');
            }

            // check if there are no groups visible -> show 'no matches' notification
            // else clear any previous message
            if (visibleGroupCount === 0) {
                // empty result
                loc = this.instance.getLocalization('errors');
                this.accordion.showMessage(loc.noResults);
            } else {
                this.accordion.removeMessage();
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
            var relatedKeywords;
            // clear only if sent keyword has changed or it is not null
            if (this.sentKeyword && this.sentKeyword !== keyword) {
                relatedKeywords = oskarifield.find('.related-keywords');
                //remove keydown events from input (those are for autocompletion popup)
                oskarifield.find('input').off("keydown");
                relatedKeywords.remove();
            }
        },

        /**
         * @method _relatedKeywordsPopup
         * @private
         * @param {String} keyword
         *      keyword to filter layers by
         * Shows and hides layers by comparing the given keyword to the text in layer containers layer-keywords div.
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _relatedKeywordsPopup: function (keyword, event, me) {
            //"use strict";
            event.preventDefault();
            var oskarifield = jQuery(event.currentTarget).parents('.oskarifield'),
                input,
                positionX,
                positionY,
                loc,
                relatedKeywordsCont,
                ajaxUrl;

            if (!keyword || keyword.length === 0) {
                this._showAllLayers();
                return;
            }
            if (keyword.length < 4) {
                //TODO at least 4 letters notification
                // empty result
                oskarifield.find('.related-keywords').remove();
                input = oskarifield.find('input');
                positionY = input.position().top + input.outerHeight();
                positionX = input.position().left;

                loc = me.instance.getLocalization('errors');
                relatedKeywordsCont = jQuery(me.templates.relatedKeywords);
                relatedKeywordsCont.css({
                    top: positionY,
                    left: positionX,
                    padding: '3px 5px'
                });
                relatedKeywordsCont.text(loc.minChars);
                oskarifield.append(relatedKeywordsCont);
                return;
            }

            me.sentKeyword = keyword;

            // if there is a popup already -> select related keyword and quit.
            if (me._selectedKeywordFromPopup(event, me)) {
                return;
            }

            ajaxUrl = this.instance.sandbox.getAjaxUrl();
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: ajaxUrl + 'action_route=SearchKeywords&keyword=' + keyword + '&lang=' + Oskari.getLang(),
                success: function (pResp) {
                    me.relatedKeywords = pResp;
                    me._showRelatedKeywords(pResp, oskarifield);
                },
                error: function (jqXHR, textStatus) {
                    var lctn = me.instance.getLocalization('errors');
                    me.accordion.showMessage(lctn.generic);
                }
            });
        },
        /**
         * @method _selectedKeywordFromPopup
         * @private
         * @param {String} event
         *      get the selected keyword
         * Checks which keyword is selected
         */
        _selectedKeywordFromPopup: function (event, me) {
            //"use strict";
            var oskarifield = jQuery(event.currentTarget).parents('.oskarifield'),
                suggestions = oskarifield.find('.keyword-cont'),
                ret = false,
                i,
                suggestion;

            for (i = 0; i < suggestions.length; i += 1) {
                suggestion = jQuery(suggestions[i]);
                if (suggestion.hasClass('focus')) {
                    me._filterRelatedLayers(suggestion, me);
                    ret = suggestion;
                    break;
                }
            }

            return ret;
        },

        /**
         * @method _showRelatedKeywords
         * @private
         * @param {Object} keywords
         *      related keywords to filter layers by
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _showRelatedKeywords: function (keywords, oskarifield) {
            //"use strict";
            var me = this,
                input = oskarifield.find('input'),
                positionY = input.position().top + input.outerHeight(),
                positionX = input.position().left,
                //create a popup div for related keywords;
                relatedKeywordsCont = jQuery(me.templates.relatedKeywords),
                i,
                keyword,
                keywordTmpl,
                keywordType;

            me.clearRelatedKeywordsPopup(null, oskarifield);
            relatedKeywordsCont.css({
                top: positionY,
                left: positionX
            });

            // no results for keyword text was preferred over "keyword(0)"
            if (keywords.length === 1 && !keywords[0].type && keywords[0].layers.length === 0) {
                relatedKeywordsCont.append(jQuery(me.templates.keywordsTitle).text(me._locale.errors.noResultsForKeyword));
            } else {
                relatedKeywordsCont.append(jQuery(me.templates.keywordsTitle).text('Avainsanat:'));

                for (i = 0; i < keywords.length; i += 1) {
                    keyword = keywords[i];
                    if (keyword.layers.length > 0) {
                        keywordTmpl = jQuery(me.templates.keywordContainer);
                        keywordTmpl
                            .addClass((i % 2 !== 0 ? ' odd' : ''))
                            .attr('data-id', keyword.id)
                            .find('.keyword').text(keyword.keyword + ' (' + keyword.layers.length + ')');

                        if (keyword.type) {
                            keywordType = jQuery(me.templates.keywordType);
                            keywordType.attr('title', me._locale.types[keyword.type]);
                            keywordTmpl.append(keywordType.text(keyword.type.toUpperCase()));
                        }

                        relatedKeywordsCont.append(keywordTmpl);
                    }
                }
            }
            //add related keywords popup
            oskarifield.append(relatedKeywordsCont);

            // when clicked -> filter layers
            relatedKeywordsCont.find('.keyword-cont').on("click", function (event) {
                // remove arrow keys (since there is no popup) 
                oskarifield.off("keydown");
                me._filterRelatedLayers(jQuery(event.currentTarget), me);
            });

            // select one word below current one;
            me.filterField.bindDownKey(function (event) {
                event.stopPropagation();
                var suggestions = relatedKeywordsCont.find('.keyword-cont'),
                    moved = false,
                    j,
                    suggestion,
                    nextIndex,
                    next;
                for (j = 0; j < suggestions.length; j += 1) {
                    suggestion = jQuery(suggestions[j]);
                    if (suggestion.hasClass('focus')) {
                        // suggestions list + 1 because we don't want to force selection 
                        nextIndex = (j + 1) % (suggestions.length + 1);
                        if (nextIndex > suggestions.length) {
                            suggestions.removeClass('focus');
                        } else {
                            next = jQuery(suggestions[nextIndex]);
                            suggestions.removeClass('focus');
                            next.addClass('focus');
                            moved = true;
                        }
                        break;
                    }
                }
                if (!moved) {
                    jQuery(suggestions[0]).addClass('focus');
                }
            });

            // select one word below current one
            me.filterField.bindUpKey(function (event) {
                event.stopPropagation();
                var suggestions = relatedKeywordsCont.find('.keyword-cont'),
                    moved = false,
                    j,
                    suggestion,
                    nextIndex,
                    next;

                for (j = 0; j < suggestions.length; j += 1) {
                    suggestion = jQuery(suggestions[j]);
                    if (suggestion.hasClass('focus')) {
                        // suggestions list + 1 because we don't want to force selection 
                        nextIndex = (j - 1) % (suggestions.length + 1);
                        if (nextIndex > suggestions.length) {
                            suggestions.removeClass('focus');
                        } else {
                            next = jQuery(suggestions[nextIndex]);
                            suggestions.removeClass('focus');
                            next.addClass('focus');
                            moved = true;
                        }
                        break;
                    }
                }
                if (!moved) {
                    jQuery(suggestions[suggestions.length - 1]).addClass('focus');
                }
            });

        },
        /**
         * @method _filterRelatedLayers
         * @private
         * @param {String} keywordContainer
         *      keywordContainer contains kwywords
         * Shows and hides layers by comparing the given layer ids to layer ids found from keywordJSON
         * Also checks if all layers in a group is hidden and hides the group as well.
         */
        _filterRelatedLayers: function (keywordContainer, me) {
            //"use strict";
            // find data for clicked element
            var id = keywordContainer.attr("data-id"),
                data = me.relatedKeywords,
                i,
                loc,
                group,
                layers,
                //visibleGroupCount,
                visibleLayerCount,
                n,
                layer,
                layerId,
                layerCont,
                bln,
                m;

            for (i = 0; i < data.length; i += 1) {
                if (data[i].id === id) {
                    data = data[i];
                    break;
                }
            }

            keywordContainer.parents('.oskarifield').find('input').val(data.keyword);

            //remove listeners from related keywords / options
            keywordContainer.parent().find('.keyword-cont').off();

            // if there are no layers
            if (data.layers.length === 0) {
                // empty result
                loc = me.instance.getLocalization('errors');
                me.accordion.showMessage(loc.noResults);
            } else {
                me.accordion.removeMessage();
            }

            //filter layers
            //visibleGroupCount = 0;
            for (i = 0; i < this.layerGroups.length; i += 1) {
                group = this.layerGroups[i];
                layers = group.getLayers();
                visibleLayerCount = 0;
                for (n = 0; n < layers.length; n += 1) {
                    layer = layers[n];
                    layerId = layer.getId();
                    layerCont = this.layerContainers[layerId];
                    bln = false;
                    for (m = 0; m < data.layers.length; m += 1) {
                        if (layerId === data.layers[m]) {
                            bln = true;
                        }
                    }
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
                //if (group.layerListPanel.isVisible()) {
                //    visibleGroupCount += 1;
                //}
                group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount + '/' + layers.length + ')');
            }

            // remove popup
            keywordContainer.parents('.oskarifield').find('.related-keywords').remove();

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
                group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
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
