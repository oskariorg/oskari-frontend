/**
 * Creates the UI for ELF Geonetwork search service and
 * adds it as a tab to the search bundle.
 *
 * @class Oskari.elf.geolocator.GeoLocatorSeachTab
 */
Oskari.clazz.define('Oskari.elf.geolocator.GeoLocatorSeachTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.elf.geolocator.BundleInstance} instance
     *     reference to the component that created the tab
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.locationTypeUrl = this.sandbox.getAjaxUrl() + '&action_route=GetLocationType';
        this.countryUrl = this.sandbox.getAjaxUrl() + '&action_route=GetELFCountriesData&lang=' + Oskari.getLang();
        this.loc = instance.getLocalization('tab');
        this.templates = {};
        //Selections for advanced search
        this.selections = [];
        this.results = {locationtypes:{id:[],name:[]}, namelanguages:[]};

        for (var t in this.__templates) {
            if(this.__templates.hasOwnProperty(t)) {
                this.templates[t] = jQuery(this.__templates[t]);
            }
        }
        this.resultsGrid = this.__initResultsGrid();
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner');
        this.tabContent = this.__initContent();
    }, {
        __templates: { container: '<div class="geolocator">'
                +    '<div class="geolocator-search">'
                +        '<div class="errors"></div>'
                +        '<form>'
                +            '<div class="search-fields"></div>'
                +            '<div class="search-buttons">'
                +            '<div class="commit">'
                +                '<input type="submit" />'
                +            '</div>'
                +          '</div>'
                +    '  <div class="moreLess"><a href="JavaScript:void(0);" class="moreLessLink"></a></div>'
                +        '</form>'
                +   '  <div class="searchadvanced"></div>'
                +    '</div>'
                +    '<div class="geolocator-results">'
                +        '<div class="header-results">'
                +           '<p>'
                +               '<span class="title"></span>'
                +               '<span class="back elf-fake-link"></span>'
                +           '</p>'
                +        '</div>'
                +        '<div class="search-results"></div>'
                +    '</div>'
                +'</div>',
            addInput:
            '<div class="additional-input">' +
            '   <div class="controls">' +
            '    <input type="radio" />' +
            '    <label></label>' +
            '  </div>' +
            '</div>',
            addInputCbx:
            '<div class="additional-input">' +
            '   <div class="controls">' +
            '    <input type="checkbox" />' +
            '    <label></label>' +
            '  </div>' +
            '</div>',
            countryAutoInput:
            '<div class="geoLocatorRow ui-country-autocomplete-widget">' +
              '<div class="rowLabel"></div>' +
              '<div class="ui-country-autocomplete-widget">' +
              '<label for="countries"></label>' +
              '<input id="countries">' +
              '</div>' +
            '</div>',
            emptyDiv: '<div><br/></div>',
            result: '<div class="result"></div>',

            geoLocatorDropdown: jQuery(
                '<div class="geoLocatorDropdown">' +
                '  <select class="geolocatorDef"></select>' +
                '</div>'
            ),
            dropdownRow: jQuery(
                '<div class="geoLocatorRow dropdownRow">' +
                '  <div class="rowLabel"></div>' +
                '</div>'
            ),
            dropdownOption: jQuery('<option class="opt"></option>'),
            geoLocatorCheckbox: jQuery(
                '<div class="geolocatorType">' +
                '  <label class="geolocatorTypeText">' +
                '    <input type="checkbox" class="geoLocatorMultiDef">' +
                '  </label>' +
                '</div>'
            ),
            checkboxRow: jQuery(
                '<div class="geoLocatorRow checkboxRow">' +
                '  <div class="checkboxRow">' +
                  '  <input class="chk" type="checkbox" name="addresses" value="bar" checked>Addresses<input class="chk" type="checkbox" name="geographical_names" checked>Geographical Names<br>' +
                ' </div>' +
                '</div>'
            ),
            nearestFilterRow: jQuery(
                '<div class="geoLocatorRow nearestFilterRow">' +
                '  <div class="nearestFilterRow">' +
                  '  <input class="nearestcheck" type="checkbox" name="nearest" value="bar">Sort by nearest</input>' +
                ' </div>' +
                '</div>'
            )
          },
          getAdvancedSearchParams: function( val ) {
            var searchValues = [];
            var obj = {};
            var queryValue;
              for( var i = 0; i< val.length; i++ ) {
               var selected = val[i].find(':selected').text();
               var n = parseInt(selected);
               n ? queryValue = n : queryValue = selected;

               var queryKey = val[i].find(':selected').val();

               if( queryKey !== "empty" ){
                  obj[queryKey] = queryValue;
               }
          }
          searchValues.push(obj);
          return searchValues;
          },
          _getDropdownValue: function( advancedContainer ) {
            var dropdownRows = advancedContainer.find('.dropdownRow');
            for (i = 0; i < dropdownRows.length; i += 1) {
                dropdownDefs = jQuery(dropdownRows[i]).find('.geolocatorDef');
                if (dropdownDefs.length === 0) {
                    continue;
                }
                for (j = 0; j < dropdownDefs.length; j += 1) {
                    dropdownDefs = jQuery(dropdownDefs[j]);
                    if (dropdownDefs.find(':selected')) {
                        this.selections.push(dropdownDefs);
                    }
                }
            }
          },
          _createAdvancedPanel: function (data, advancedContainer) {
              var me = this,
                  i,
                  newRow,
                  newLabel,
                  j,
                  newDropdown,
                  dropdownDef,
                  emptyOption,
                  newOption,
                  names = { dropdown:["LocationType","NameLanguage"]
                          },
                  regionInput = Oskari.clazz.create('Oskari.userinterface.component.TextInput','elf-geolocator-region', this.sandbox),
                  countryInput = this.templates.countryAutoInput.clone(),
                  newCheckBoxRow = me.__templates.checkboxRow.clone();
                  filterRow = me.__templates.nearestFilterRow.clone();

              countryInput.find('div.rowLabel')
                      .text(this.loc.countryFilter);

              this.regionInput = regionInput;
              advancedContainer.append(filterRow);
              advancedContainer.append(newCheckBoxRow);
              advancedContainer.append(countryInput);
              // Populate autocomplete countries
              this.__getCountries();

              //generate dropdown rows from data
              var count = _.keys( this.results ).length;
              var tmp = [];
              var resultArray = {locationtypes:{id:[], name:[]}, namelanguages:[] };
              for( i = 0; i < count; i++ ){
                if( i === 0 ){
                  for( var k = 0; k < _.keys( this.results.locationtypes.id ).length; k++ ){
                    resultArray.locationtypes.id.push( this.results.locationtypes.id[k] );
                    resultArray.locationtypes.name.push( this.results.locationtypes.id[k]  + ": " + this.results.locationtypes.name[k]  );
                    }
                    newLabel = this.loc.locationFilter;
                  }
                  else{
                    for( var j = 0; j < this.results.namelanguages.length; j++ ){
                      resultArray.namelanguages.push( this.results.namelanguages[j] );
                    }
                    newLabel = this.loc.namelangFilter;
                   }
                   i === 0 ? tmp = resultArray.locationtypes.name : tmp = resultArray.namelanguages;
                    newRow = null;
                    newRow = me.__templates.dropdownRow.clone();
                      newRow.find('div.rowLabel').text(newLabel);
                      newDropdown =  me.__templates.geoLocatorDropdown.clone();
                      dropdownDef = newDropdown.find('.geolocatorDef');
                      emptyOption = me.__templates.dropdownOption.clone();
                      emptyOption.attr('value', 'empty');
                      emptyOption.text(me.loc.emptyOption);
                      dropdownDef.append(emptyOption);
                       for (j = 0; j < tmp.length; j++) {
                           newOption = me.__templates.dropdownOption.clone();
                           newOption.attr('value', names.dropdown[i]);
                           newOption.text(tmp[j]);
                           dropdownDef.append(newOption);
                       }
                      newRow.append(newDropdown);
                      advancedContainer.append(newRow);
                }

                  advancedContainer.append(newRow);

                  filterRow.find("input.nearestcheck").change(function(){
                    if(filterRow.find("input.nearestcheck").is(":checked")){
                      newCheckBoxRow.find("input.chk").prop('disabled', true);
                      countryInput.find("input.ui-autocomplete-input").prop('disabled', true);
                      advancedContainer.find("select.geolocatorDef").prop('disabled', true);
                    }
                    else{
                      newCheckBoxRow.find("input.chk").prop('disabled', false);
                      countryInput.find("input.ui-autocomplete-input").prop('disabled', false);
                      advancedContainer.find("select.geolocatorDef").prop('disabled', false);
                    }
                  });
              },
        /**
         * @method getTitle
         * @return {String}
         */
        getTitle: function () {
            return this.loc.title;
        },
        /**
         * @method getContent
         * @return {jQuery}
         */
        getContent: function () {
            return this.tabContent;
        },
        /**
         * Sends a request to the search bundle to add the UI as a tab.
         *
         * @method requestToAddTab
         */
        requestToAddTab: function () {
            var reqBuilder = this.sandbox
                    .getRequestBuilder('Search.AddTabRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(this.getTitle(), this.getContent());
                this.sandbox.request(this.instance, request);
            }
        },
        /**
         * Initializes the tab content by creating the search fields
         * and binding functionality.
         *
         * @method __initContent
         * @private
         * @return {jQuery}
         */
        __initContent: function () {
            var me = this,
                container = this.templates.container.clone(),
                searchUi = container.find('div.geolocator-search'),
                resultsUi = container.find('div.geolocator-results'),
                searchButton = searchUi.find('div.commit input[type="submit"]'),
                searchInput = Oskari.clazz.create('Oskari.userinterface.component.FormInput','elf-geolocator-search', this.sandbox),
                backButton = resultsUi.find('div.header-results span.back'),
                moreLessLink = container.find('a.moreLessLink'),
                advancedSearchVisiblity = false;

            this.__getLocationTypes();
            searchInput.setRequired(true, this.loc.errors.searchTermMissing);
            searchInput.addClearButton();
            searchInput.getField().addClass('search-field');
            searchInput.setLabel(this.loc.searchTitle);
            searchInput.setPlaceholder(this.loc.searchPlaceholder);

            moreLessLink.html(this.loc.showMore);

            moreLessLink.on('click', function () {
              advancedSearchVisiblity = true;
              var advancedContainer = jQuery('div.searchadvanced');
              if (moreLessLink.html() === me.loc.showMore) {
                  // open advanced/toggle link text
                  moreLessLink.html(me.loc.showLess);
                  if (advancedContainer.is(':empty')) {
                          me._createAdvancedPanel(data, advancedContainer);
                      }
                   else {
                      advancedContainer.show();
                  }
              } else {
                  advancedSearchVisiblity = false;
                  // close advanced/toggle link text
                  advancedContainer.hide();
                  moreLessLink.html(me.loc.showMore);
              }
      });

            searchButton.val(this.loc.searchButton).on('click submit', function (e) {
                    e.preventDefault();
                    var values = me.__getValues( advancedSearchVisiblity );
                    me.__removeErrors(container);
                    if (values.errors) {
                        me.__addErrors(values.errors);
                    } else {
                        me.__doSearch(values);
                        searchUi.hide();
                        resultsUi.show();
                    }
                });

            backButton.text(this.loc.backButton).on('click', function () {
                    resultsUi.hide();
                    searchUi.show();
                });

            container.find('div.search-fields')
                .append(searchInput.getField())
                .append(this.templates.emptyDiv.clone()); // use later when data is available   .append(regionInput.getField());

            resultsUi.find('div.header-results span.title')
                .append(this.__getSearchResultsTitle());

            this.progressSpinner
                .insertTo(resultsUi.find('div.search-results'));

            resultsUi.hide();

            this.searchInput = searchInput;

            return container;
        },
        /**
         * Returns the title for the search results.
         * Appends the result count to it if given.
         *
         * @method __getSearchResultsTitle
         * @private
         * @param  {Number} count
         * @param  {[]} method   search method
         * @return {String}
         */
        __getSearchResultsTitle: function (count, method) {
            var title = this.loc.resultsTitle;
            // Add search method to title (method might be changed in backend)
            if (method !== undefined && method !== null) {
                for(var key in method[0]) {
                    if (method[0][key] === 'fuzzy') {
                        title = this.loc.fuzzyResultsTitle;
                    }
                    else if (method[0][key] === 'filter') {
                        title = this.loc.filterResultsTitle;
                    }
                }
            }
            if (count !== undefined && count !== null) {
                title += (' (' + count + ')');
            }

            return title;
        },
        /**
         * Returns the form values.
         * If there were validations errors the return object
         * has a key `errors`
         *
         * @method __getValues
         * @private
         * @return {Object}
         */
        __getValues: function ( advVisiblity ) {
            var values = {},
                container = this.getContent(),
                termErrors = this.searchInput.validate(),
                lon = this.sandbox.getMap().getX(),
                lat = this.sandbox.getMap().getY();

            if (termErrors && termErrors.length) {
                values.errors = termErrors;
            }

            this._getDropdownValue(container);
            //selections is defined in the _createAdvancedPanel method
            var params = this.getAdvancedSearchParams(this.selections);
            /* params[0].LocationType
               params[0].NameLanguage */
            this.selections = [];
            values.term = this.searchInput.getValue();

            if(jQuery(container).find('input[name=addresses]')[0] === undefined && jQuery(container).find('input[name=geographical_names]')[0] === undefined){
              values.addresses = true;
              values.geographical_names = true;
            }
            else {
              values.addresses = jQuery(container).find('input[name=addresses]')[0].checked;
              values.geographical_names = jQuery(container).find('input[name=geographical_names]')[0].checked;
            }

            if( advVisiblity ){
            values.nearest = jQuery(container).find('input[name=nearest]')[0].checked;
            if(values.nearest){
              values.lon = lon;
              values.lat = lat;
            }
            else {
              if(params[0].LocationType){
                values.locationtype = params[0].LocationType;
              }
              if(params[0].NameLanguage){
                values.namelanguage = params[0].NameLanguage;
              }
              values.region = this.regionInput.getValue();
              if (container.find('#countries').val()) {
              values.country = container
                  .find('#countries').attr('country');
              }
            }
          }
            return values;
        },
        /**
         * Performs the search through the search service.
         *
         * @method __doSearch
         * @private
         * @param  {Object} values
         */
        __doSearch: function(values) {
            var me = this;

            me.__beforeSearch();

            this.instance.getSearchService().doSearch(values,
                function (results) {
                    me.__handleSearchResult(results);
                },
                function () {
                    me.__handleSearchResult();
                });
        },
        /**
         * Performs the elf country list selection  through the search service.
         *
         * @method __getCountries
         * @private
         * @param  {Object} values
         */
        __getCountries: function() {
            var me = this;
            this.instance.getSearchService().getCountries(me.countryUrl,
                function (results) {
                    me.__handleCountryResult(results);
                },
                function () {
                    me.__handleCountryResult();
                });
        },
        /**
         * Performs the elf location tyåe selection  through the search service.
         *
         * @method __getLocationTypes
         * @private
         * @param  {Object} values
         */
        __getLocationTypes: function(){
          var me = this;
          this.instance.getSearchService().getLocationType(me.locationTypeUrl,
          function (results) {
            me.__handleLocationTypeResults(results);
          },
          function(){
            me.__handleLocationTypeResults();
          });
        },
        /**
         * Empties the search results div and starts the progress spinner.
         *
         * @method __beforeSearch
         * @private
         */
        __beforeSearch: function () {
            var container = this.getContent().find('div.geolocator-results');

            container.find('div.search-results')
                .addClass('loading')
                .empty();
            container.find('div.header-results span.title')
                .text(this.__getSearchResultsTitle());
            this.progressSpinner.start();
        },
        /**
         * Renders the search results or a notification of an error.
         *
         * @method __handleSearchResult
         * @private
         * @param  {Object} results
         */
        __handleSearchResult: function (results) {
            var container = this.getContent().find('div.geolocator-results');
            this.progressSpinner.stop();
            container.find('div.search-results').removeClass('loading');

            if (results) {
                this.__renderSearchResults(results, container);
            } else {
                this.__handleSearchError(container);
            }
        },
        /**
         * Get celf country names for country filtering.
         *
         * @method __handleCountryResult
         * @private
         * @param  {Object} results
         */
        __handleCountryResult: function (results) {
            if(jQuery.isEmptyObject(results)) {
                return;
            }

            var container = this.getContent().find('div.geolocator-search');

            //populate autocomplete source (ELF countries)
            jQuery(function() {
                container.find('#countries').autocomplete({
                    minLength: 0,
                    source: results,
                    select: function(event, ui) {
                        container.find('#countries').attr('country',ui.item.id);
                    }
                }).focus(function (event) {
                      event.preventDefault();
                      container.find('#countries').val('');
                      container.find('#countries').autocomplete('search', '');
                  });
                });
        },
        __handleLocationTypeResults: function (results){
          if (!results) {
            return;
          }
          for(var i = 0; i<results[0].SI_LocationTypes.length; i++){
            this.results.locationtypes.id[i] = results[0].SI_LocationTypes[i].id;
            this.results.locationtypes.name[i] = results[0].SI_LocationTypes[i].name;
          }
          for(var j = 0; j<results[1].NameLanguages.length; j++){
            this.results.namelanguages.push(results[1].NameLanguages[j]);
          }
          // sort the languages to make it easier to find one
          this.results.namelanguages.sort();
        },
        /**
         * Renders the search results to a div.
         *
         * @method __renderSearchResults
         * @private
         * @param  {Object} results
         * @param  {jQuery} container
         */
        __renderSearchResults: function (results, container) {
            var resultsTitle = container.find('div.header-results span.title'),
                resultsContainer = container.find('div.search-results'),
                resultsGrid = this.resultsGrid,
                resultsModel;

            resultsTitle
                .text(this.__getSearchResultsTitle(results.totalCount, results.methods));

            if (results.totalCount <= 0) {
                resultsContainer.append(this.loc.noResults);
            } else {
                resultsModel = this.__getGridModel(results.locations);
                resultsGrid
                    .setDataModel(resultsModel);
                resultsGrid
                    .renderTo(resultsContainer);
            }
        },
        /**
         * Renders a message to the results div notifying of an error.
         *
         * @method __handleSearchError
         * @private
         * @param  {jQuery} container
         */
        __handleSearchError: function (container) {
            container
                .find('div.search-results')
                .append(this.loc.errors.searchFailed);
        },
        /**
         * Initializes the Oskari grid for displaying the search results.
         *
         * @method __initResultsGrid
         * @private
         * @return {Oskari.userinterface.component.Grid}
         */
        __initResultsGrid: function () {
            var me = this,
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'),
                visibleFields = ['name', 'village', 'type'];

            grid.setVisibleFields(visibleFields);

            grid.setColumnValueRenderer('name', function(name, data) {
                var nameTemplate = jQuery('<div class="nameColumn"></div>'),
                    link = jQuery('<span class="elf-fake-link"></span>');

                link.append(name).on('click', function() {
                    me.instance.resultClicked(data);
                });

                nameTemplate.append(link);

                if (data.exonymNames) {
                    _.forEach(data.exonymNames, function (name) {
                        var listElement = jQuery('<li class="exonymList"></li>');
                        listElement.html(name);
                        nameTemplate.append(listElement);
                    });
                }
                return nameTemplate;
            });

            _.each(visibleFields, function(field) {
                grid.setColumnUIName(field, me.loc.grid[field]);
            });

            return grid;
        },
        /**
         * Creates a model for the results grid containing the search results.
         *
         * @method __getGridModel
         * @private
         * @param  {Object} results
         * @return {Oskari.userinterface.component.GridModel}
         */
        __getGridModel: function (results) {
            var gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');

            _.each(results, function (result) {
                gridModel.addData({
                    'exonymNames': result.exonymNames,
                    'id': result.id,
                    'name': result.name,
                    'village': result.village,
                    'type': result.type,
                    'rank': result.rank,
                    'lon': result.lon,
                    'lat': result.lat,
                    'zoomScale': result.zoomScale
                });
            });

            return gridModel;
        },
        /**
         * Displays the error messages in a div
         * and adds a class to the error input fields.
         *
         * @method __addErrors
         * @private
         * @param  {Object[]} errors
         */
        __addErrors: function (errors) {
            var container = this.getContent(),
                errorContainer = container.find('div.errors');

            _.each(errors, function (error) {
                container
                    .find('input[name=' + error.field + ']')
                    .addClass('elf-error');
                errorContainer
                    .append('<p>' + error.error + '</p>');
            });
        },
        /**
         * Empties the error div and removes the error class
         * from the input fields.
         *
         * @method __removeErrors
         * @private
         * @param  {jQuery} container
         */
        __removeErrors: function (container) {
            container = container || this.getContent();
            container.find('div.errors').empty();
            container.find('input').removeClass('elf-error');
        }

    });
