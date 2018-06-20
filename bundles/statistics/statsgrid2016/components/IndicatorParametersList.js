/**
 * This component manage the different year/regionset combinations listing for indicator data.
 * Also asks for selector values/regionset when user adds another dataset (selector combination for indicator)
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParametersList', function (locale) {
    this.locale = locale;
    this.element = null;
    this.addDatasetButton = null;
    this.availableRegionsets = [];
    this.select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
    this.service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.errorService = this.service.getErrorService();
    // this.regionselect = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', service, locale);
    this.createUi();
    Oskari.makeObservable(this);
}, {
    __templates: {
        main: _.template('<div class="user-indicator-main"><div class="my-indicator"></div><div class="new-indicator-dataset-params"><div class="util-row"></div></div></div>'),
        table: '<table><tbody></tbody></table>',
        tableHeader: _.template(
            '<thead>' +
                '<tr>' +
                    '<th style="float:left"> ${title} </th> ' +
                '</tr>' +
             '</thead>'
        ),
        tableRow: _.template(
            '<tr> ' +
                '<td class="user-dataset"> ${year} - ${regionset} </td> ' +
                '<td class="user-dataset-edit"> <a href="#"> ${edit} </a> </td> ' +
                '<td class="user-dataset-delete"> <a href="#"> ${remove} </a> </td> ' +
            '</tr>'
        ),
        form: '<div class="userchoice-container"></div>',
        input: _.template('<input type="text" style="width: 40%; height: 1.6em" name="${name}" placeholder="${label}"><br />')
    },
    getElement: function () {
        return this.element;
    },
    createUi: function () {
        if (this.getElement()) {
            return this.getElement();
        }
        var me = this;

        var main = jQuery(this.__templates.main());
        this.element = main;
        me.requestIndicatorSelectors();

        return this.getElement();
    },
    createTable: function () {
        var me = this;
        var myIndicator = this.getElement().find('.my-indicator');

        var table = jQuery(this.__templates.table);
        var theader = this.__templates.tableHeader({
            title: me.locale('userIndicators.modify.title')
        });
        myIndicator.empty();
        table.append(theader);
        myIndicator.append(table);
        return myIndicator.find('table');
    },
    setDatasets: function (datasets) {
        var me = this;
        this.getElement().find('.my-indicator').empty();
        if (!datasets || !datasets.length) {
            return;
        }
        var table = this.createTable();
        table.find('tbody').empty();
        var isLoggedIn = Oskari.user().isLoggedIn();
        datasets.forEach(function (dataset) {
            var item = jQuery(me.__templates.tableRow({
                year: me.locale('parameters.year') + ' ' + dataset.year,
                regionset: me.getRegionsetName(dataset.regionset),
                edit: me.locale('userIndicators.modify.edit'),
                remove: me.locale('userIndicators.modify.remove')
            }));
            item.find('.user-dataset-edit').on('click', function (evt) {
                me.trigger('insert.data', {
                    year: dataset.year,
                    regionset: Number(dataset.regionset)
                });
            });
            // delete is only shown for logged in users to prevent issues with cached data
            if (isLoggedIn) {
                item.find('.user-dataset-delete').on('click', function (evt) {
                    me.trigger('delete.data', {
                        year: dataset.year,
                        regionset: Number(dataset.regionset)
                    });
                });
            }
            table.find('tbody').append(item);
        });
    },
    setRegionsets: function (availableRegionsets) {
        this.availableRegionsets = availableRegionsets;
    },
    getRegionsetName: function (id) {
        var regionset = this.availableRegionsets.find(function (regionset) {
            return regionset.id === id;
        });
        if (regionset) {
            return regionset.name;
        }
        return id;
    },
    resetIndicatorSelectors: function () {
        var formContainer = this.getElement().find('.new-indicator-dataset-params');
        formContainer.empty();
        return formContainer;
    },
    requestIndicatorSelectors: function () {
        // TODO: year etc as params
        var input = jQuery(this.__templates.input({
            name: 'year',
            label: this.locale('parameters.year')
        }));
        var formContainer = this.resetIndicatorSelectors();
        var userChoiceContainer = jQuery(this.__templates.form);
        userChoiceContainer.append(input);
        formContainer.append(userChoiceContainer);

        var regionsetContainer = jQuery('<div class="regionset-container"></div>');
        regionsetContainer.append('<div>' + this.locale('panels.newSearch.selectRegionsetPlaceholder') + '</div>');
        regionsetContainer.append(this.select.create(this.availableRegionsets, {
            allow_single_deselect: false,
            placeholder_text: this.locale('panels.newSearch.selectRegionsetPlaceholder'),
            width: '100%'
        }));
        this.select.selectFirstValue();
        this.select.adjustChosen();
        userChoiceContainer.append(regionsetContainer);

        // create buttons
        var btnContainer = jQuery('<div style="display:flex"></div>');
        formContainer.append(btnContainer);

        var me = this;
        var showTableBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.AddButton');
        showTableBtn.insertTo(btnContainer);
        showTableBtn.setHandler(function (event) {
            var errors = false;

            if (input.val().length === 0) {
                me.errorService.show(me.locale('errors.title'), me.locale('errors.myIndicatorYearInput'));
                errors = true;
            }
            if (!me.select.getValue()) {
                me.errorService.show(me.locale('errors.title'), me.locale('errors.myIndicatorRegionselect'));
                errors = true;
            }

            if (!errors) {
                me.resetIndicatorSelectors();
                me.trigger('insert.data', {
                    year: input.val(),
                    regionset: Number(me.select.getValue())
                });
            }
        });
    }
});
