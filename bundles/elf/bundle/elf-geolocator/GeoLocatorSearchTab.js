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
        this.tabContent = this.__initContent();
    }, {
        __templates: {
            container: '<div class="geolocator">' +
                    '<div class="geolocator-search">' +
                        '<div class="errors"></div>' +
                        '<div class="search-fields"></div>' +
                        '<div class="search-additionals">' +
                            '<div class="input-fields"></div>' +
                        '</div>' +
                        '<div class="commit"></div>' +
                    '</div>' +
                    '<div class="geolocator-results">' +
                        '<div class="search-results"></div>' +
                    '</div>' +
                '</div>',
            button: '<input type="button" />',
            addInput: '<div class="additional-input">' +
                    '<div class="controls">' +
                        '<input type="checkbox" />' +
                        '<label></label>' +
                    '</div>' +
                '</div>',
            result: '<div></div>'
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
                searchButton = this.templates.button.clone(),
                fuzzyCheck = this.templates.addInput.clone(),
                exonymCheck = this.templates.addInput.clone(),
                backButton = this.templates.button.clone();

            searchInput.setRequired(true, this.loc.errors.searchTermMissing);
            searchInput.addClearButton();
            searchInput.getField().addClass('search-field')
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
                .on('click', function (e) {
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
                .val(this.loc.backButton)
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

            container.find('div.commit')
                .append(searchButton);

            resultsUi
                .prepend(backButton)
                .hide();

            this.searchInput = searchInput;
            this.regionInput = regionInput;

            return container;
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

            this.instance.getSearchService().doSearch(values,
                function (results) {
                    me.__handleSearchResult(results);
                },
                function (error) {
                    me.__handleSearchResult();
                });
        },
        __handleSearchResult: function (results) {
            var container = this.getContent().find('div.search-results');
            container.empty();

            if (results) {
                this.__renderSearchResults(results, container);
            } else {
                this.__handleSearchError(container);
            }
        },
        __renderSearchResults: function (results, container) {
            var resultTemplate = this.templates.result,
                resultDiv;

            _.each(results.locations, function (result) {
                resultDiv = resultTemplate.clone();
                resultDiv
                    .append(result.name)
                    .append(' - ')
                    .append(result.au);
                container.append(resultDiv);
            });
        },
        __handleSearchError: function (container) {
            container.append(this.loc.errors.searchFailed);
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
