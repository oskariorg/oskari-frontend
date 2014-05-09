/**
 * @class Oskari.elf.geolocator.GeoLocatorSeachTab
 */
Oskari.clazz.define('Oskari.elf.geolocator.GeoLocatorSeachTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.elf.geolocator.BundleInstance} instance
     *     reference to component that created the tab
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.loc = instance.getLocalization('tab');
        this.templates = {};
        for (var t in this.__templates) {
            this.templates[t] = jQuery(this.__templates[t]);
        }
        this.resultsGrid = this.__initResultsGrid();
        this.progressSpinner = Oskari.clazz.create(
            'Oskari.userinterface.component.ProgressSpinner');
        this.tabContent = this.__initContent();
    }, {
        __templates: {
            container: '<div class="geolocator">'
                +    '<div class="geolocator-search">'
                +        '<div class="errors"></div>'
                +        '<form>'
                +            '<div class="search-fields"></div>'
                +            '<div class="search-additionals">'
                +                '<div class="input-fields"></div>'
                +            '</div>'
                +            '<div class="commit">'
                +                '<input type="submit" />'
                +            '</div>'
                +        '</form>'
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
            button: '<input type="button" />',
            addInput: '<div class="additional-input">'
                +    '<div class="controls">'
                +        '<input type="checkbox" />'
                +        '<label></label>'
                +    '</div>'
                +'</div>',
            result: '<div class="result"></div>'
        },
        getTitle: function () {
            return this.loc.title;
        },
        getContent: function () {
            return this.tabContent;
        },
        requestToAddTab: function () {
            var reqBuilder = this.sandbox
                    .getRequestBuilder('Search.AddTabRequest'),
                request;

            if (reqBuilder) {
                request = reqBuilder(this.getTitle(), this.getContent());
                this.sandbox.request(this.instance, request);
            }
        },
        __initContent: function () {
            var me = this,
                container = this.templates.container.clone(),
                searchUi = container.find('div.geolocator-search'),
                resultsUi = container.find('div.geolocator-results'),
                searchInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.FormInput',
                    'elf-geolocator-search', this.sandbox),
                regionInput = Oskari.clazz.create(
                    'Oskari.userinterface.component.FormInput',
                    'elf-geolocator-region', this.sandbox),
                searchButton = searchUi.find('div.commit input[type="submit"]'),
                fuzzyCheck = this.templates.addInput.clone(),
                exonymCheck = this.templates.addInput.clone(),
                backButton = resultsUi.find('div.header-results span.back');

            searchInput.setRequired(true, this.loc.errors.searchTermMissing);
            searchInput.addClearButton();
            searchInput.getField().addClass('search-field');
            searchInput.setLabel(this.loc.searchTitle);
            searchInput.setPlaceholder(this.loc.searchPlaceholder);

            regionInput.addClearButton();
            regionInput.getField().addClass('search-field');
            regionInput.setLabel(this.loc.regionTitle);
            regionInput.setPlaceholder(this.loc.regionPlaceholder);

            fuzzyCheck
                .find('input')
                    .attr({
                        'id': 'elf-geolocator-search-fuzzy',
                        'name': 'elf-geolocator-search-fuzzy'
                    })
                    .end()
                .find('label')
                    .attr('for', 'elf-geolocator-search-fuzzy')
                    .text(this.loc.fuzzyTitle);

            exonymCheck
                .find('input')
                    .attr({
                        'id': 'elf-geolocator-search-exonym',
                        'name': 'elf-geolocator-search-exonym'
                    })
                    .end()
                .find('label')
                    .attr('for', 'elf-geolocator-search-exonym')
                    .text(this.loc.exonymTitle);

            searchButton
                .val(this.loc.searchButton)
                .on('click submit', function (e) {
                    e.preventDefault();
                    var values = me.__getValues();

                    me.__removeErrors(container);

                    if (values.errors) {
                        me.__addErrors(values.errors);
                    } else {
                        me.__doSearch(values);
                        searchUi.hide();
                        resultsUi.show();
                    }
                });

            backButton
                .text(this.loc.backButton)
                .on('click', function (e) {
                    resultsUi.hide();
                    searchUi.show();
                });

            container.find('div.search-fields')
                .append(searchInput.getField())
                .append(regionInput.getField());

            container.find('div.search-additionals')
                .prepend('<p>' + this.loc.additionalsTitle + '</p>')
                .find('div.input-fields')
                    .append(fuzzyCheck)
                    .append(exonymCheck);

            resultsUi.find('div.header-results span.title')
                .append(this.__getSearchResultsTitle());

            this.progressSpinner
                .insertTo(resultsUi.find('div.search-results'));

            resultsUi.hide();

            this.searchInput = searchInput;
            this.regionInput = regionInput;

            return container;
        },
        __getSearchResultsTitle: function (count) {
            var title = this.loc.resultsTitle;

            if (count !== undefined && count !== null) {
                title += (' (' + count + ')');
            }

            return title;
        },
        __getValues: function () {
            var values = {},
                container = this.getContent(),
                termErrors = this.searchInput.validate();

            if (termErrors && termErrors.length) {
                values.errors = termErrors;
            }

            values.term   = this.searchInput.getValue();
            values.region = this.regionInput.getValue();
            values.fuzzy  = container
                .find('input[name=elf-geolocator-search-fuzzy]')
                .is(':checked');
            values.exonym = container
                .find('input[name=elf-geolocator-search-exonym]')
                .is(':checked');;

            return values;
        },
        __doSearch: function (values) {
            var me = this;

            me.__beforeSearch();

            this.instance.getSearchService().doSearch(values,
                function (results) {
                    me.__handleSearchResult(results);
                },
                function (error) {
                    me.__handleSearchResult();
                });
        },
        __beforeSearch: function () {
            var container = this.getContent().find('div.geolocator-results');

            container.find('div.search-results')
                .addClass('loading')
                .empty();
            container.find('div.header-results span.title')
                .text(this.__getSearchResultsTitle());
            this.progressSpinner.start();
        },
        __handleSearchResult: function (results) {
            var container = this.getContent().find('div.geolocator-results');

            this.progressSpinner.stop();
            container.find('div.search-results')
                .removeClass('loading');

            if (results) {
                this.__renderSearchResults(results, container);
            } else {
                this.__handleSearchError(container);
            }
        },
        __renderSearchResults: function (results, container) {
            var resultsTitle = container.find('div.header-results span.title'),
                resultsContainer = container.find('div.search-results'),
                resultsGrid = this.resultsGrid,
                resultsModel;

            resultsTitle
                .text(this.__getSearchResultsTitle(results.totalCount));

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
        __handleSearchError: function (container) {
            container
                .find('div.search-results')
                .append(this.loc.errors.searchFailed);
        },
        __initResultsGrid: function () {
            var me = this,
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'),
                visibleFields = ['name', 'village', 'type'];

            grid.setVisibleFields(visibleFields);

            grid.setColumnValueRenderer('name', function (name, data) {
                var link = jQuery('<span class="elf-fake-link"></span>');

                link.append(name).on('click', function (e) {
                    me.__resultClicked(data);
                });

                return link;
            });

            _.each(visibleFields, function (field) {
                grid.setColumnUIName(field, me.loc.grid[field]);
            });

            return grid;
        },
        __resultClicked: function (result) {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                zoomLevel = sandbox.getMap().getZoom(),
                srsName = sandbox.getMap().getSrsName(),
                lonlat = new OpenLayers.LonLat(result.lon, result.lat),
                popupId = "elf-geolocator-search-result",
                moveReqBuilder = sandbox
                    .getRequestBuilder('MapMoveRequest'),
                infoBoxReqBuilder = sandbox
                    .getRequestBuilder('InfoBox.ShowInfoBoxRequest'),
                moveReq,
                infoBoxReq,
                infoBoxContent;

            if (moveReqBuilder) {
                moveReq = moveReqBuilder(
                    result.lon, result.lat, zoomLevel, false, srsName);
                sandbox.request(instance, moveReq);
            }

            if (infoBoxReqBuilder) {
                infoBoxContent = {
                    html: this.__getInfoBoxHtml(result),
                    actions: {}
                };
                infoBoxReq = infoBoxReqBuilder(
                    popupId, this.loc.resultsTitle,
                    [infoBoxContent], lonlat, true);
                sandbox.request(instance, infoBoxReq);
            }
        },
        __getInfoBoxHtml: function (result) {
            var template = '<h3><%= name %></h3>'
                    + '<p><%= village %></p>'
                    + '<p><%= type %></p>';

            return _.template(template, result);
        },
        __getGridModel: function (results) {
            var gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel');

            gridModel.setIdField('id');

            _.each(results, function (result) {
                gridModel.addData({
                    'id': result.id,
                    'name': result.name,
                    'village': result.village,
                    'type': result.type,
                    'rank': result.rank,
                    'lon': result.lon,
                    'lat': result.lat
                });
            });

            return gridModel;
        },
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
        __removeErrors: function (container) {
            container = container || this.getContent();
            container.find('div.errors').empty();
            container.find('input').removeClass('elf-error');
        }
    });
