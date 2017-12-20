/**
 * @class Oskari.mapframework.bundle.search.Flyout
 *
 * Renders the "search" flyout.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.search.DefaultView',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.mapframework.bundle.search.SearchBundleInstance}
     * Instance reference to component that created the tile
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = this.instance.getSandbox();
        this.searchservice = instance.service;
        this.state = null;
        // last search result is saved so we can sort it in client
        this.lastResult = null;
        // last sort parameters are saved so we can change sort direction
        // if the same column is sorted again
        this.lastSort = null;
        // Actions that get added to the search result popup
        this.resultActions = {};
        this._searchContainer = null;

        this.resultHeaders = [
            {
                title: this.instance.getLocalization('grid').name,
                prop: 'name'
            }, {
                title: this.instance.getLocalization('grid').region,
                prop: 'region'
            }, {
                title: this.instance.getLocalization('grid').type,
                prop: 'type'
            }
        ];
        this.__templates.resultheading = _.template('<div><h3>' +
            this.instance.getLocalization('searchResults') + ' ${count} ' +
            this.instance.getLocalization('searchResultsDescription') + ' ${search}</h3></div>');
    }, {
    	__templates : {
			main : _.template(
			    '<div class="searchContainer">' +
                '  <div class="searchDescription">${desc}</div>' +
                '  <div class="controls">' +
                '  </div>' +
                '  <div><br></div>' +
                '  <div class="info"></div>' +
                '  <div><br></div>' +
                '  <div class="resultList"></div>' +
                '</div>'),
            resultTable : _.template(
            	'<table class="search_result oskari-grid">' +
                '  <thead><tr></tr></thead>' +
                '  <tbody></tbody>' +
                '</table>'),
            resultTableHeader : _.template('<th><a href="JavaScript:void(0);">${title}</a></th>'),
            resultTableRow : _.template(
                '<tr>' +
                '  <td><a href="JavaScript:void(0);">${name}</a></td>' +
                '  <td>${region}</td>' +
                '  <td>${type}</td>' +
                '</tr>')
    	},
        /**
         * @method createUi
         * Creates the UI for a fresh start
         */
        createUi: function (container) {
            var me = this;
            var sandbox = me.getSandbox();
            var ui = jQuery(container);
            ui.empty();
            // create ui
            var searchContainer = this.getContainer();
            var field = this.getField();
            var button = this.getButton();

            var doSearch = function () {
                field.setEnabled(false);
                button.setEnabled(false);
            	me.__doSearch();
            };

            var doAutocompleteSearch = function(e) {
                if(e.keyCode === 38 || e.keyCode === 40 ) { // arrow keys up/down
                    return;
                }
                me.__doAutocompleteSearch();
            };

            button.setHandler(doSearch);
            field.bindEnterKey(doSearch);

            if(this.instance.conf.autocomplete === true) {
                field.bindUpKey(doAutocompleteSearch);
                field.bindAutocompleteSelect(function(event, ui){
                    field.setValue(ui.item.value);
                    doSearch();
                });
            }

            var controls = searchContainer.find('div.controls');
            controls.append(field.getField());
            controls.append(button.getElement());

            // add it to container
            ui.append(searchContainer);
        },
        getContainer : function() {
        	if(!this._searchContainer) {
	            var searchContainer = this.__templates.main({
	            	desc : this.instance.getLocalization('searchDescription')
	            });
	            this._searchContainer = jQuery(searchContainer);
	        }
        	return this._searchContainer;
        },
        /**
         * The search field
         * @return {Oskari.userinterface.component.FormInput}
         */
        getField : function() {
        	var me = this;
        	if(!this._searchField) {
        		// TODO: change to TextInput, but it doesn't have setIds()
	            var field = Oskari.clazz.create('Oskari.userinterface.component.FormInput');
	            this._searchField = field;
	            field.setPlaceholder(this.instance.getLocalization('searchAssistance'));
	            field.setIds('oskari_search_forminput', 'oskari_search_forminput_searchassistance');

	            if (this.instance.safeChars) {
	                var regex = /[\s\w\d\.\,\?\!\-äöåÄÖÅ]*\*?$/;
	                field.setContentCheck(true, this.instance.getLocalization('invalid_characters'), regex);
	            }

	            field.bindChange(function (event) {
	            	me.__searchTextChanged(field.getValue());
	            });
	            field.addClearButton('oskari_search_forminput_clearbutton');
        	}
        	return this._searchField;
        },
        /**
         * The search field
         * @return {Oskari.userinterface.component.FormInput}
         */
        getButton : function() {
        	if(!this._searchBtn) {
	            var button = Oskari.clazz.create('Oskari.userinterface.component.buttons.SearchButton');
	            button.setId('oskari_search_button_search');
	            this._searchBtn = button;
        	}
            return this._searchBtn;
        },
        __searchTextChanged : function(value) {
            var me = this;
            var sandbox = me.getSandbox();
            var searchContainer = this.getContainer();
            if (me.state === null) {
                me.state = {};
            }
            me.state.searchtext = value;
            if (!value) {
                // remove results when field is emptied
                searchContainer.find('div.info').empty();
                searchContainer.find('div.resultList').empty();

                // try to remove markers if request is available when field is emptied
                var reqBuilder = sandbox.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest');
                if (reqBuilder) {
                    sandbox.request(me.instance.getName(), reqBuilder());
                }
            }
        },

        __doSearch : function() {
        	var me = this;
			var field = this.getField();
            var button = this.getButton();
            var searchContainer = this.getContainer();

            searchContainer.find('div.resultList').empty();
            searchContainer.find('div.info').empty();

            // TODO: make some gif go round and round so user knows
            // something is happening
            var searchKey = field.getValue(this.instance.safeChars);

            if (!this._validateSearchKey(field.getValue(false))) {
                field.setEnabled(true);
                button.setEnabled(true);
                return;
            }

            var reqBuilder = me.getSandbox().getRequestBuilder('SearchRequest');
            if(reqBuilder) {
                var request = reqBuilder(searchKey);
                me.getSandbox().request(this.instance, request);
            }
        },
        __doAutocompleteSearch : function() {
            var field = this.getField();
            var searchKey = field.getValue(this.instance.safeChars);
            this.searchservice.doAutocompleteSearch(searchKey, function(result) {
                var autocompleteValues =  [];
                for (var i = 0; i < result.methods.length; i++) {
                    autocompleteValues.push({ value: result.methods[i], data: result.methods[i] });
                }
                field.autocomplete(autocompleteValues);
            });
        },

        handleSearchResult : function(isSuccess, result, searchedFor) {
            var me = this;
            var field = this.getField();
            var button = this.getButton();
            if(isSuccess) {
                field.setEnabled(true);
                button.setEnabled(true);
                me._renderResults(result, searchedFor);
                return;
            }
            // error handling
            field.setEnabled(true);
            button.setEnabled(true);

            var errorKey = result ? result.responseText : null,
                msg = me.instance.getLocalization('searchservice_search_not_found_anything_text');

            if (errorKey) {
                if (typeof me.instance.getLocalization(errorKey) === 'string') {
                    msg = me.instance.getLocalization(errorKey);
                }
            }
            me._showError(msg);
        },

        focus: function () {
            this.getField().focus();
        },

        _validateSearchKey: function (key) {
            var me = this;
            // empty string
            if (key === null || key === undefined || key.length === 0) {
                me._showError(me.instance.getLocalization('cannot_be_empty'));
                return false;
            }
            // too many stars
            if ((key.match(/\*/g) || []).length > 1) {
                me._showError(me.instance.getLocalization('too_many_stars'));
                return false;
            }
            // not enough characters accompanying a star
            if (key.indexOf('*') > -1 && key.length < 5) {
                me._showError(me.instance.getLocalization('too_short'));
                return false;
            }

            // invalid characters (or a star in the wrong place...)
            if (me.instance.safeChars) {
                if (!/^[a-zåäöA-ZÅÄÖ \.,\?\!0-9]+\**$/.test(key)) {
                    me._showError(me.instance.getLocalization('invalid_characters'));
                    return false;
                }
            }
            return true;
        },

        _showError: function (error) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                okButton = dialog.createCloseButton('OK');

            dialog.setId('oskari_search_error_popup');
            dialog.makeModal();

            dialog.show(
                    this.instance.getLocalization('searchservice_search_alert_title'),
                    error, [okButton]
            );
        },
        __getSearchResultHeader : function(count, hasMore) {
        	var intro = _.template(this.instance.getLocalization('searchResultCount') + ' ${count} ' + this.instance.getLocalization('searchResultCount2'));
        	var msg = intro({count : count});
        	msg = msg + '<br/>';

            if (hasMore) {
                // more results available
        		msg = msg + this.instance.getLocalization('searchResultDescriptionMoreResults');
        		msg = msg + '<br/>';
            }
            return msg + this.instance.getLocalization('searchResultDescriptionOrdering');
        },

        _renderResults: function (result, searchKey) {
            if (!result || typeof result.totalCount !== 'number') {
                return;
            }

            var me = this;
            var ui = me.getContainer();
            var resultList = ui.find('div.resultList');
            var info = ui.find('div.info');

            // save reference to result
            me.lastResult = result;
            // clear previous results
            resultList.empty();
            info.empty();

            var inst = me.instance;
            // error handling
            if (result.totalCount === -1) {
                resultList.append(
                	this.instance.getLocalization('searchservice_search_alert_title') + ': ' +
                	this.instance.getLocalization(result.errorText));
                return;
            } else if (result.totalCount === 0) {
                resultList.append(
                	inst.getLocalization('searchservice_search_alert_title') + ': ' +
                	inst.getLocalization('searchservice_search_not_found_anything_text'));
                return;
            } else {
            	info.append(this.__getSearchResultHeader(result.totalCount, result.hasMore));
            }

            if (result.totalCount === 1) {
                // move map etc
                me._resultClicked(result.locations[0]);
            }
            // render results
            var table = jQuery(this.__templates.resultTable()),
                tableHeaderRow = table.find('thead tr'),
                tableBody = table.find('tbody');

            _.each(this.resultHeaders, function(headerItem) {
                var header = me.__templates.resultTableHeader({ title : headerItem.title });
                header = jQuery(header);
                var link = header.find('a');
                link.bind('click',  function () {
                    // clear table for sorted results
                    tableBody.empty();
                    // default to descending sort
                    var descending = false;
                    // if last sort was made on the same column ->
                    // change direction
                    if (me.lastSort && me.lastSort.attr === headerItem.prop) {
                        descending = !me.lastSort.descending;
                    }
                    // sort the results
                    var locations = me._sortResults(headerItem.prop, descending, result.locations);
                    // populate table content
                    me._populateResultTable(tableBody, locations);
                    // apply visual changes
                    tableHeaderRow.find('th').removeClass('asc');
                    tableHeaderRow.find('th').removeClass('desc');
                    if (descending) {
                        link.parent().addClass('desc');
                    } else {
                        link.parent().addClass('asc');
                    }
                    return false;
                });
                tableHeaderRow.append(header);
            });

            this._populateResultTable(tableBody, result.locations);
            resultList.append(this.__templates.resultheading({
            	count : result.totalCount,
            	search : searchKey
            }));
            resultList.append(table);
        },

        _populateResultTable: function (resultsTableBody, locations) {
            var me = this;
            _.each(locations, function(row) {
                var resultRow = me.__templates.resultTableRow(row);
                resultRow = jQuery(resultRow);
                resultRow.find('a').click(function() {
                    me._resultClicked(row);
                    return false;
                });
                resultsTableBody.append(resultRow);
            });
        },

        _resultClicked: function (result) {
            var me = this,
                popupId = 'searchResultPopup',
                inst = this.instance,
                sandbox = inst.sandbox;
            // good to go
            // Note! result.ZoomLevel is deprecated. ZoomScale should be used instead
            var moveReqBuilder = sandbox.getRequestBuilder('MapMoveRequest'),
                zoom = result.zoomLevel;
            if(result.zoomScale) {
                zoom = {scale : result.zoomScale};
            }
            sandbox.request(
                me.instance.getName(),
                moveReqBuilder(result.lon, result.lat, zoom)
            );

            var loc = this.instance.getLocalization('resultBox'),
                resultActions = [],
                resultAction,
                action;
            for (var name in this.resultActions) {
                if (this.resultActions.hasOwnProperty(name)) {
                    action = this.resultActions[name];
                    resultAction = {};
                    resultAction.name = name;
                    resultAction.type = 'link';
                    resultAction.action = action(result);
                    resultAction.group = 1;
                    resultActions.push(resultAction);
                }
            }

            var closeAction = {};
            closeAction.name = loc.close;
            closeAction.type = 'link';
            closeAction.group = 1;
            closeAction.action = function () {
                var rN = 'InfoBox.HideInfoBoxRequest',
                    rB = sandbox.getRequestBuilder(rN),
                    request = rB(popupId);
                sandbox.request(me.instance.getName(), request);
            };
            resultActions.push(closeAction);

            var contentItem = {
                html: '<h3>' + result.name + '</h3>' + '<p>' + result.region + '<br/>' + result.type + '</p>',
                actions: resultActions
            };
            var content = [contentItem];

            var options = {
                hidePrevious: true
            };

            var rN = 'InfoBox.ShowInfoBoxRequest',
                rB = sandbox.getRequestBuilder(rN),
                request = rB(
                    popupId,
                    loc.title,
                    content,
                    {   
                        lon: result.lon,
                        lat: result.lat
                    },
                    options
                );

            sandbox.request(this.instance.getName(), request);
        },

        /**
         * @private @method _sortResults
         * Sorts the last search result by comparing given attribute on
         * the search objects
         *
         * @param {String} pAttribute attributename to sort by (e.g.
         * result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         *
         */
        _sortResults: function (pAttribute, pDescending, locations) {
            var me = this;
            if (!this.lastResult) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            locations.sort(function (a, b) {
                return Oskari.util.naturalSort(a[pAttribute].toLowerCase(), b[pAttribute].toLowerCase(), pDescending);
            });
            return locations;
        },

        addSearchResultAction: function (action) {
            this.resultActions[action.name] = action.callback;
        },

        removeSearchResultAction: function (name) {
            delete this.resultActions[name];
        },
        getSandbox : function() {
        	return this.sandbox;
        },
        /**
         * @method setState
         * @param {Object} state
         */
        setState: function (state) {
            this.state = state;
        },

        /**
         * @method getState
         * @return {Object} state
         */
        getState: function () {
            if (!this.state) {
                return {};
            }
            return this.state;
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
