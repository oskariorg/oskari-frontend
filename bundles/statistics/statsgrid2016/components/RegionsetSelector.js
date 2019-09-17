import SelectList from './SelectList';

Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetSelector', function (service, locale) {
    this.service = service;
    this.localization = {
        label: locale('parameters.regionset') || 'Regionset',
        noRegionset: locale('panels.newSearch.noRegionset'),
        placeholder: locale('panels.newSearch.selectionValues.regionset.placeholder') || locale('panels.newSearch.defaultPlaceholder')
    };
    this.dropdown = null;
}, {
    __templates: {
        select: _.template('<div class="parameter"><div class="label">${label}</div><div class="clear"></div></div>'),
        option: _.template('<option value="${id}">${name}</option>')
    },
    /**
     * Get regionset selection.
     * @method  @public create
     *
     * @param  {Number[]} restrictTo  restrict selection to regions with matching ids
     * @param  {Boolean} useDivmanazer If true, uses divmanazer's SelectList component. Otherwise uses statsgrids own SelectList. Defaults to true.
     * @return {Object}           jQuery element
     */
    create: function (restrictTo, useDivmanazer = true) {
        var me = this;
        var loc = this.localization;
        var allowedRegionsets = this.__getOptions(restrictTo);
        if (!allowedRegionsets.length) {
            var noRegionSetResult = jQuery('<div class="noresults">' + loc.noRegionset + '</div>');
            noRegionSetResult.addClass('margintop');
            return {
                container: noRegionSetResult,
                field: noRegionSetResult,
                oskariSelect: noRegionSetResult,
                value: function () {}
            };
        }
        var fieldContainer = jQuery(me.__templates.select({
            id: 'regionset',
            clazz: 'stats-regionset-selector',
            placeholder: loc.placeholderText,
            label: loc.label
        }));

        let select = null;
        if (useDivmanazer) {
            const options = {
                allowReset: false,
                placeholder_text: loc.placeholder
            };
            select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
            this.dropdown = select.create(allowedRegionsets, options);
        } else {
            const options = {
                search: false,
                placeholder: loc.placeholder
            };
            select = new SelectList();
            this.dropdown = select.create(allowedRegionsets, options);
        }
        var jqSelect = this.dropdown.find('select');
        fieldContainer.find('.label').append(this.dropdown);
        if (useDivmanazer) {
            select.adjustChosen();
        };

        return {
            container: fieldContainer,
            oskariSelect: fieldContainer.find('.oskari-select'),
            value: function (value) {
                if (typeof value === 'undefined') {
                    return select.getValue();
                }
                select.setValue(value);
            },
            selectInstance: select,
            field: jqSelect
        };
    },
    setWidth: function (width) {
        if (!this.dropdown) {
            return;
        }
        this.dropdown.css({ width });
        this.dropdown.parent().css({ width });
    },
    __getOptions: function (restrictTo) {
        var allRegionsets = this.service.getRegionsets();
        if (!restrictTo) {
            return allRegionsets;
        }
        var allowedRegionsets = [];
        allRegionsets.forEach(function (regionset) {
            if (restrictTo.indexOf(regionset.id) !== -1) {
                regionset.title = regionset.name;
                allowedRegionsets.push(regionset);
            }
        });
        return allowedRegionsets;
    }
});
