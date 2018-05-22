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
     * @param  {Object} indicator indicator. If is set indicator, then grep allowed regions. Else if indicator is not defined then shows all regions.
     * @return {Object}           jQuery element
     */
    create: function (restrictTo, disableReset) {
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
        var options = {
            allowReset: false,
            placeholder_text: loc.placeholder,
            allow_single_deselect: true,
            disable_search_threshold: 10,
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        this.dropdown = select.create(allowedRegionsets, options);
        fieldContainer.find('.label').append(this.dropdown);
        select.adjustChosen();
        var jqSelect = this.dropdown.find('select');

        return {
            container: fieldContainer,
            oskariSelect: fieldContainer.find('.oskari-select'),
            value: function (value) {
                if (typeof value === 'undefined') {
                    return jqSelect.val();
                }
                jqSelect.val(value);
                jqSelect.trigger('chosen:updated');
            },
            selectInstance: select,
            field: jqSelect
        };
    },
    setWidth: function (width) {
        if (!this.dropdown) {
            return;
        }
        this.dropdown.css({ width: width });
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
