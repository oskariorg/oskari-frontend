/**
 * @class Oskari.statistics.bundle.statsgrid.view.IndicatorSelector
 *
 * Creates indicator selector
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.view.IndicatorSelector',
    /**
     * @static constructor function
     */
    function (localization, service) {
    	this._locale = localization;
    	this.service = service;
    	var me = this;
    	this.el = null;
    	this.__activeDataSource = null;
    	this.__activeIndicator = null;
    	this.__dataSourceSelect = null;
    	this.__indicatorSelect = null;
    	this.__indicatorButton = null;
        this.dialog = null;
    },
    {
    	__templates : {
    		main : '<div class="indicatorselector">' + 
    					'<div class="data-source-select"></div>' + 
    					'<div class="selectors-container">' + 
    						'<div class="indicator-cont"></div>' + 
    						'<div class="parameters-cont"></div>' + 
    					'</div>' + 
    				'</div>',
    		option : '<option></option>',
    		infoIcon : '<div class="icon-info"></div>',
    		datasourceSelector : '<div class="selector-cont">' +
		                            '<label for="statsgrid-data-source-select"></label>' +
		                            '<select id="statsgrid-data-source-select" class="indi">' +
		                            '</select>' +
		                        '</div>',
			indicatorSelector : '<div class="indisel selector-cont">' + 
									'<label for="statsgrid-indicator-select"></label>' + 
									'<select id="statsgrid-indicator-select" name="indi" class="indi"><option value="" selected="selected"></option></select>' + 
								'</div>',
			indicatorOptionSelector : '<div class="selector-cont"><label></label><select></select></div>'
    	},

    	render : function(container) {
            var me = this,
                el = jQuery(this.__templates.main);
            this.el = el;
            el.find("div.data-source-select").append(this._createDataSourceSelect());
            var selectorsContainer = el.find('.selectors-container');
			selectorsContainer.find('.indicator-cont').append();

        	var indicatorContainer = selectorsContainer.find('.indicator-cont');
            indicatorContainer.append(me._createIndicatorsSelect());

            container.append(el);

            var btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SearchButton');
            btn.setHandler(function() {
            	alert(JSON.stringify(me.getSelections()));
            });
            btn.insertTo(el);
            this.__indicatorButton = btn;
            btn.setEnabled(false);

    		this.service.getDataSources(function(dsList) {
	    		me.setDataSources(dsList, true);
    		});
    	},

        setDataSources : function(items) {
        	this.__setSelectOptions(this.__dataSourceSelect, items, true);
			this.setIndicators([]);
        },
        setIndicators : function(indicators) {
        	this.__setSelectOptions(this.__indicatorSelect, indicators, false);
        	this.changeIndicator();
        },
        changeDataSource : function(id) {
            this.setIndicators([]);
        	var ds = this.service.getDataSource(id);
            if (!ds)  {
            	alert("Couldn't find Datasource for id " + id);
            	return;
            }
            var me = this;
            this.__activeDataSource = ds;

            //clear the selectors containers
        	this.service.getIndicators(id, function(indicators){
        		if(!indicators) {
        			// something went wrong
        			return;
        		}
            	me.setIndicators(indicators)
        	});
        	var indicatorParamsContainer = this.getIndicatorParamsContainer();


            //this.createDemographicsSelects(container, null);
        },
        changeIndicator : function(id) {
			var me = this;
            if(!id) {
				// clear previous indicator options
				this._createIndicatorOptions();
            	return;
            }
            // setup values for options
	        var optionsContainer = this.getIndicatorParamsContainer(),
	         	ds = this.getActiveDatasource();

	        this.service.getIndicator(ds.getId(), id, function(indicator) {
	        	if(!indicator) {
	        		// something went wrong
	        	}
    			me.__activeIndicator = indicator;
	        	_.each(ds.getIndicatorParams(), function(item) {
	        		var select = optionsContainer.find('select[name=' + item.name + ']');
	        		var options = [];
	        		if(indicator) {
	        			options = indicator.getParamValues(item.name);
	        		}
	        		// clear previous values
	        		select.empty();
	        		if(options.length === 0) {
	        			// no options for this select in selected indicator
	                	select.attr('disabled', 'disabled');
	                	return;
	        		}
	                select.removeAttr('disabled');
	        		_.each(options, function(opt) {
	        			me._addOption(opt, opt, select);
	        		});
	        	});
	        	me.__createIndicatorInfoButton(indicator);
	        	me.__indicatorButton.setEnabled(!!indicator)
	        });
            	

                //me.deleteIndicatorInfoButton(container);
                //me.getStatsIndicatorMeta(container, indicatorId);
        },
        getIndicatorParamsContainer : function() {
			return this.el.find('.parameters-cont');
        },
        getActiveDatasource : function() {
			return this.__activeDataSource;
        },
        getActiveIndicator : function() {
			return this.__activeIndicator;
        },
        getSelections : function() {
        	var result = {
        		datasource : null,
        		indicator : null,
        		options : {}
        	}
        	if(this.getActiveDatasource()) {
        		result.datasource = this.getActiveDatasource().getId();
        	}
        	if(this.getActiveIndicator()) {
        		result.indicator = this.getActiveIndicator().getId();
	        	var optionsContainer = this.getIndicatorParamsContainer(),
	        		select = optionsContainer.find('select');

        		_.each(select, function(opt) {
        			var dom = jQuery(opt),
        				value = dom.val();
        			if(value !== null && value !== undefined) {
        				result.options[dom.attr('name')] = value;
        			}
        		});
        	}
        	return result;
        },



        /**
         * Create indicator meta info button
         *
         * @method createIndicatorInfoButton
         * @param container parent element
         * @param indicator meta data
         */
        __createIndicatorInfoButton: function (indicator) {
            // clear previous indicator
            this.__removeIndicatorInfoButton();
        	if(!indicator) {
        		return;
        	}
            var me = this,
                infoIcon = jQuery(this.__templates.infoIcon),
                indicatorCont = this.el.find('.indicator-cont'),
                meta = indicator.getMetadata();
            // append this indicator
            indicatorCont.append(infoIcon);
            // show meta data
            infoIcon.click(function (e) {
                var lang = Oskari.getLang(),
                    desc = '<h4 class="indicator-msg-popup">' + me._locale.stats.descriptionTitle + 
                    	'</h4><p>' + meta.description[lang] + '</p><br/><h4 class="indicator-msg-popup">' + me._locale.stats.sourceTitle + 
                    	'</h4><p>' + meta.organization.title[lang] + '</p>';
                me.showMessage(meta.title[lang], desc);
            });
        },
        __removeIndicatorInfoButton : function() {
            this.el.find('.indicator-cont').find('.icon-info').remove();
        },

        /**
         * @method showMessage
         * Shows user a message with ok button
         * @param {String} title popup title
         * @param {String} message popup message
         */
        showMessage: function (title, message, buttons) {
            // Oskari components aren't available in a published map.
            if (this.dialog) {
                this.dialog.close(true);
                this.dialog = null;
                return;
            }

            var me = this,
                loc = this._locale,
                dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            if (buttons) {
                dialog.show(title, message, buttons);
            } else {
                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
                okBtn.setHandler(function () {
                    dialog.close(true);
                    me.dialog = null;
                });
                dialog.show(title, message, [okBtn]);
                me.dialog = dialog;
            }
        },

		/**
         * Create datasource drop down select
 		 * @return {DOMElement} [description]
 		 * @private
 		 */
        _createDataSourceSelect: function () {
            var me = this,
                dsElement = jQuery(this.__templates.datasourceSelector),
                sel = dsElement.find('select');

            dsElement.find('label').text(this._locale.tab.grid.organization);

            sel.on('change', function (e) {
                me.changeDataSource(e.target.value);
            });
            sel.chosen({
                no_results_text: this._locale.noDataSource,
                placeholder_text: this._locale.selectDataSource
            });

            me.__dataSourceSelect = sel;
            return dsElement;
        },
        /**
         * Create indicators drop down select
         *
         * @method createIndicatorsSelect
 		 * @return {DOMElement} [description]
         */
        _createIndicatorsSelect: function () {
            var me = this;
            // Indicators' select container etc.
            var indicatorSelector = jQuery(this.__templates.indicatorSelector),
            	select = indicatorSelector.find('select');
            indicatorSelector.find('label').append(this._locale.indicators);

            // if the value changes, fetch indicator meta data
            select.change(function (e) {
                var option = select.find('option:selected'),
                    isOwn = option.attr('data-isOwnIndicator');
                me.changeIndicator(option.val(), (isOwn === 'true'));
            });

            // we use chosen to create autocomplete version of indicator select element.
            select.chosen({
                no_results_text: this._locale.noMatch,
                placeholder_text: this._locale.selectIndicator
            });
            // used when populating later on 
            this.__indicatorSelect = select;
            // this gives indicators more space to show title on dropdown
            jQuery('.chzn-drop').css('width', '298px');
            jQuery('.chzn-search input').css('width', '263px');
            return indicatorSelector;
        },
        /**
         * Creates indicator options panel
         * @return {[type]}      [description]
         */
        _createIndicatorOptions: function () {
        	var optionsContainer = this.getIndicatorParamsContainer();
            optionsContainer.empty(); // == me.deleteDemographicsSelect(container);
            this.__removeIndicatorInfoButton();
        	var ds = this.getActiveDatasource();
        	if(!ds) {
        		// no datasource selection, only clear
        		return;
        	}
            var me = this;
            // Indicators' select container etc.
        	_.each(ds.getIndicatorParams(), function(item) {
	            var indicatorSelector = jQuery(me.__templates.indicatorOptionSelector),
	            	label = indicatorSelector.find('label'),
	            	select = indicatorSelector.find('select'),
	            	labelText = item.name;
	            // TODO: setup options locales in own structure like ~me.locale.optionLabels[key] 
   	            if(me._locale[item.name]) {
   	            	labelText = me._locale[item.name];
	            }
            	label.append(labelText);
	            select.attr('name', item.name);
	            select.attr('disabled', 'disabled');
	            optionsContainer.append(indicatorSelector);
        	});
        	/*
	        	var optionsContainer = this.getIndicatorParamsContainer();
	        	_.each(ds.getIndicatorParams(), function(item) {
	                optionsContainer.find('select.' + item.getName()).attr('disabled', 'disabled');
	        	});
*/
//            me._addOwnIndicatorButton(optionsContainer);
        },
        /**
         * Setup options to a select element based on given items
         * @param  {DOMElement} select    [description]
         * @param  {Object[]} items     [description]
         * @param  {Boolean} preselect [description]
         */
        __setSelectOptions : function(select, items, preselect) {

        	var me = this,
                lang = Oskari.getLang();
        	select.empty();
            _.each(items, function(item) {
                if (!item.getId()) {
                	return;
                }
                var opt = me._addOption(item.getId(), item.getName(lang), select);
                opt.attr('data-isOwnIndicator', !!item.ownIndicator);
            });
            // don't really know why 'liszt' instead of chosen but the linked chosen version seems to use it
            select.trigger('liszt:updated');
            if(preselect && items.length > 0) {
            	select.trigger('change', { target : { value : items[0].getId() }});
            }
        },
        /**
         * Create an option for select and add it to given select element if given
         * @param {String} id     [description]
         * @param {String} value  [description]
         * @param {DOMElement} select (optional))
         * @private
         */
        _addOption: function (id, value, select) {
            var option = jQuery(this.__templates.option);
            option.val(id).text(value);
            if(select) {
            	select.append(option);
            }
            return option;
        }

    }
);
