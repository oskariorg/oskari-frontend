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
function(instance, title) {
    this.instance = instance;
    this.title = title;
    this.layerGroups = [];
    this.layerContainers = {};
    this.templates = {
        'shortDescription'  : '<div class="field-description"></div>',
        'description'       : '<div><h4 class="indicator-msg-popup"></h4><p></p></div>',
        'relatedKeywords'   : '<div class="related-keywords"></div>',
        'keywordsTitle'     : '<div class="keywords-title"></div>',
        'keywordContainer'  : '<div class="keyword-cont"><div class="keyword"></div></div>',
        'keywordType'       : '<div class="type"></div>'
    };
    this._createUI();
}, {
    getTitle : function() {
        return this.title;
    },
    getTabPanel : function() {
        return this.tabPanel;
    },
    getState : function() {
        var state = {
            tab : this.getTitle(),
            filter : this.filterField.getValue(),
            groups : []
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
    setState : function(state) {
        if(!state) {
            return;
        }
        
        if(!state.filter) {
            this.filterField.setValue(state.filter);
            this.filterLayers(state.filter);
        }
        if(state.groups && state.groups.length > 0) {
            // TODO: should open panels in this.accordion where groups[i] == panel.title
        }
    },
    _createUI : function() {
        
        this._locale = this.instance._localization;

        this.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
        this.tabPanel.setTitle(this.title);

        var oskarifield = this.getFilterField().getField();
        oskarifield.append(
            jQuery(this.templates.shortDescription)
            .text(this._locale['filter'].shortDescription)
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
    _createInfoIcon: function(oskarifield) {
        var me = this;
        var infoIcon = jQuery('<div class="icon-info"></div>');
        var indicatorCont = oskarifield.find('.field-description');
        // clear previous indicator
        indicatorCont.find('.icon-info').remove();
        // append this indicator
        indicatorCont.append(infoIcon);
        // show meta data
        infoIcon.click(function(e) {
            var lang = Oskari.getLang();
            var desc = jQuery(me.templates.description);
            desc.find('p').text(me._locale['filter'].description);

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okBtn.setTitle(me._locale.buttons.ok);
            okBtn.addClass('primary');
            okBtn.setHandler(function() {
                dialog.close(true);
            });
            dialog.show(me._locale['filter'].text, desc, [okBtn]);

        });
    },
    getFilterField : function() {
        if(this.filterField) {
            return this.filterField;
        }
        var me = this;
        var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
        field.setPlaceholder(this.instance.getLocalization('filter').text);
        field.addClearButton();

        field.bindChange(function(event) {
            event.stopPropagation(); // JUST BECAUSE TEST ENVIRONMENT FAILS
            // up = 38, down= 40, enter= 13
            if( event.which && 
                event.which != 38 &&
                event.which != 40 &&
                event.which != 13) {
                
                me.filterLayers(field.getValue());
                //if user types more characters we need to hide the related keywords popup
                me.clearRelatedKeywordsPopup(field.getValue(), jQuery(event.currentTarget).parents('.oskarifield'));
            }
        }, true);

        //pressing enter key fetches related keywords
        field.bindEnterKey(function(event) {
            me._relatedKeywordsPopup(field.getValue(), event, me);
        });

        // clear related keywords if focus moves.
        field.bindOnBlur(function() {
            this.relatedKeywords = null;
            var oskarifield = jQuery(field.getField()[0]);
            oskarifield.find('input').off("keydown");
//FIXME            oskarifield.find('.related-keywords').remove();
        });

        this.filterField = field;
        return field;
    },
    showLayerGroups : function(groups) {
        var me = this;
        this.accordion.removeAllPanels();
        this.layerContainers = undefined;
        this.layerContainers = {};
        this.layerGroups = groups;
        for(var i = 0; i < groups.length; ++i) {
            var group = groups[i];
            var layers = group.getLayers();
            var groupPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            groupPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
            group.layerListPanel = groupPanel;
            
            var groupContainer = groupPanel.getContainer();
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerWrapper = 
                    Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.view.Layer',
                    layer, this.instance.sandbox, this.instance.getLocalization());
                var layerContainer = layerWrapper.getContainer();
                groupContainer.append(layerContainer);
                
                this.layerContainers[layer.getId()] = layerWrapper;
            }
            this.accordion.addPanel(groupPanel);
        }
        
        var selectedLayers = this.instance.sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < selectedLayers.length; ++i) {
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
    filterLayers : function(keyword) {
        
        // show all groups
        this.accordion.showPanels();
        if(!keyword || keyword.length == 0) {
            this._showAllLayers();
            return;
        }
        // filter
        var visibleGroupCount = 0;
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            var visibleLayerCount = 0;
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                var bln = group.matchesKeyword(layerId, keyword);
                layerCont.setVisible(bln);
                if(bln) {
                    visibleLayerCount++;
                    if(visibleLayerCount%2 == 1) {
                        layerCont.getContainer().addClass('odd');
                    }
                    else {
                        layerCont.getContainer().removeClass('odd');
                    }
                    // open the panel if matching layers
                    group.layerListPanel.open();
                }
            }
            group.layerListPanel.setVisible(visibleLayerCount > 0);
            if(group.layerListPanel.isVisible()) {
                visibleGroupCount++;   
            }
            group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount +  '/' + layers.length + ')');
        }
        
        // check if there are no groups visible -> show 'no matches' notification
        // else clear any previous message
        if(visibleGroupCount == 0) {
            // empty result
            var loc = this.instance.getLocalization('errors');
            this.accordion.showMessage(loc.noResults);
        }
        else {
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
    clearRelatedKeywordsPopup: function(keyword, oskarifield) {
        // clear only if sent keyword has changed or it is not null
        if(this.sentKeyword && this.sentKeyword !== keyword) {
            var relatedKeywords = oskarifield.find('.related-keywords');
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
    _relatedKeywordsPopup : function(keyword, event, me) {
        event.preventDefault();
        var oskarifield = jQuery(event.currentTarget).parents('.oskarifield');

        if(!keyword || keyword.length == 0) {
            this._showAllLayers();
            return;
        } else if(keyword.length < 4) {
            //TODO at least 4 letters notification
            // empty result
            oskarifield.find('.related-keywords').remove()
            var input = oskarifield.find('input');
            var positionY = input.position().top + input.outerHeight();
            var positionX = input.position().left;

            var loc = me.instance.getLocalization('errors');
            var relatedKeywordsCont = jQuery(me.templates.relatedKeywords);
            relatedKeywordsCont.css({top: positionY, left: positionX, padding: '3px 5px'});
            relatedKeywordsCont.text(loc.minChars);
            oskarifield.append(relatedKeywordsCont);
            return;
        }

        me.sentKeyword = keyword;

        // if there is a popup already -> select related keyword and quit.
        if(me._selectedKeywordFromPopup(event, me)) {
            return;
        }

        var ajaxUrl = this.instance.sandbox.getAjaxUrl();
        jQuery.ajax({
            type : "GET",
            dataType: 'json',
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/j-son;charset=UTF-8");
              }
             },
            url : ajaxUrl + 'action_route=SearchKeywords&keyword='+keyword + '&lang=' + Oskari.getLang(),
            success : function(pResp) {
                me.relatedKeywords = pResp;
                me._showRelatedKeywords(pResp, oskarifield);
            },
            error : function(jqXHR, textStatus) {
                    var loc = me.instance.getLocalization('errors');
                    me.accordion.showMessage(loc.generic);
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
    _selectedKeywordFromPopup: function(event, me) {
        var oskarifield = jQuery(event.currentTarget).parents('.oskarifield');
        var suggestions = oskarifield.find('.keyword-cont');
        var ret = false;
        for (var i = 0; i < suggestions.length; i++) {
            var suggestion = jQuery(suggestions[i]);
            if(suggestion.hasClass('focus')) {
                me._filterRelatedLayers(suggestion, me);
                ret = suggestion;
                break;
            };
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
    _showRelatedKeywords : function(keywords, oskarifield) {

        var me = this;
        this.clearRelatedKeywordsPopup(null, oskarifield);

        var input = oskarifield.find('input');
        var positionY = input.position().top + input.outerHeight();
        var positionX = input.position().left;

        //create a popup div for related keywords;
        var relatedKeywordsCont = jQuery(me.templates.relatedKeywords);
        relatedKeywordsCont.css({top: positionY, left: positionX});
        
        // no results for keyword text was preferred over "keyword(0)"
        if(keywords.length == 1 && !keywords[0].type && keywords[0].layers.length == 0) {
            relatedKeywordsCont.append(jQuery(me.templates.keywordsTitle).text(me._locale.errors.noResultsForKeyword));
        } else {
            relatedKeywordsCont.append(jQuery(me.templates.keywordsTitle).text('Avainsanat:'));

            for (var i = 0; i < keywords.length; i++) {
                var keyword = keywords[i];
                if(keyword.layers.length > 0){
                    var keywordTmpl = jQuery(me.templates.keywordContainer);
                    keywordTmpl
                        .addClass((i%2 != 0 ? ' odd': ''))
                        .attr('data-id', keyword.id)
                        .find('.keyword').text(keyword.keyword+ ' (' +keyword.layers.length+')');

                    if(keyword.type) {
                        var keywordType = jQuery(me.templates.keywordType);
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
        relatedKeywordsCont.find('.keyword-cont').on("click", function(event) {
            // remove arrow keys (since there is no popup) 
            oskarifield.off("keydown");
            me._filterRelatedLayers(jQuery(event.currentTarget), me);
        });

        // select one word below current one;
        me.filterField.bindDownKey(function(event) {
            event.stopPropagation();
            var suggestions = relatedKeywordsCont.find('.keyword-cont');
            var moved = false;
            for (var i = 0; i < suggestions.length; i++) {
                var suggestion = jQuery(suggestions[i]);
                if(suggestion.hasClass('focus')) {
                    // suggestions list + 1 because we don't want to force selection 
                    var nextIndex = (i+1) % (suggestions.length+1);
                    if(nextIndex > suggestions.length) {
                        suggestions.removeClass('focus');                    
                    } else {
                        var next = jQuery(suggestions[nextIndex]);
                        suggestions.removeClass('focus');
                        next.addClass('focus');
                        moved = true;
                    }
                    break;
                }
            };
            if(!moved) {
                jQuery(suggestions[0]).addClass('focus');
            }
        });

        // select one word below current one
        me.filterField.bindUpKey(function(event) {
            event.stopPropagation();
            var suggestions = relatedKeywordsCont.find('.keyword-cont');
            var moved = false;

            for (var i = 0; i < suggestions.length; i++) {
                var suggestion = jQuery(suggestions[i]);
                if(suggestion.hasClass('focus')) {
                    // suggestions list + 1 because we don't want to force selection 
                    var nextIndex = (i-1) % (suggestions.length+1);
                    if(nextIndex > suggestions.length) {
                        suggestions.removeClass('focus');
                    } else {
                        var next = jQuery(suggestions[nextIndex]);
                        suggestions.removeClass('focus');
                        next.addClass('focus');
                        moved = true;                    
                    }
                    break;
                }
            };
            if(!moved) {
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
    _filterRelatedLayers: function(keywordContainer, me) {

        // find data for clicked element
        var id = keywordContainer.attr("data-id");
        var data = me.relatedKeywords;
        for (var i = 0; i < data.length; i++) {
            if(data[i].id == id) {
                data = data[i];
                break;
            }
        };
        keywordContainer.parents('.oskarifield').find('input').val(data.keyword)

        //remove listeners from related keywords / options
        keywordContainer.parent().find('.keyword-cont').off();

        // if there are no layers
        if(data.layers.length == 0) {
            // empty result
            var loc = me.instance.getLocalization('errors');
            me.accordion.showMessage(loc.noResults);
        } else {
            me.accordion.removeMessage();
        }

        //filter layers
        var visibleGroupCount = 0;
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            var visibleLayerCount = 0;
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                var bln = false;
                for (var m = 0; m < data.layers.length; m++) {
                    if(layerId == data.layers[m]) {
                        bln = true;
                    }
                };
                layerCont.setVisible(bln);
                if(bln) {
                    visibleLayerCount++;
                    if(visibleLayerCount%2 == 1) {
                        layerCont.getContainer().addClass('odd');
                    }
                    else {
                        layerCont.getContainer().removeClass('odd');
                    }
                    // open the panel if matching layers
                    group.layerListPanel.open();
                }
            }
            group.layerListPanel.setVisible(visibleLayerCount > 0);
            if(group.layerListPanel.isVisible()) {
                visibleGroupCount++;   
            }
            group.layerListPanel.setTitle(group.getTitle() + ' (' + visibleLayerCount +  '/' + layers.length + ')');
        }

        // remove popup
        keywordContainer.parents('.oskarifield').find('.related-keywords').remove();

    },

    
    _showAllLayers : function() {
        for(var i = 0; i < this.layerGroups.length; ++i) {
            var group = this.layerGroups[i];
            var layers = group.getLayers();
            
            for(var n = 0; n < layers.length; ++n) {
                var layer = layers[n];
                var layerId = layer.getId();
                var layerCont = this.layerContainers[layerId];
                layerCont.setVisible(true);
                if(n%2 == 1) {
                    layerCont.getContainer().addClass('odd');
                }
                else {
                    layerCont.getContainer().removeClass('odd');
                }
            }
            group.layerListPanel.setVisible(true);
            group.layerListPanel.close();
            group.layerListPanel.setTitle(group.getTitle() + ' (' + layers.length + ')');
        }
    },
    setLayerSelected : function(layerId, isSelected) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.setSelected(isSelected);
        }
    },
    updateLayerContent : function(layerId, layer) {
        var layerCont = this.layerContainers[layerId];
        if(layerCont) {
            layerCont.updateLayerContent(layer);
        }
    }
});
