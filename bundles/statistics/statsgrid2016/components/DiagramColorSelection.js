/**
 * NOTE!!!! This code has been moved from view/DiagramVisualizer without testing and since it's not used it's probably terribly broken
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.DiagramColorSelection', function() {
    this.element = null;
}, {
    __templates: {
        title: jQuery('<div class="title"></div>'),
        select: jQuery('<div class="dropdown"></div>')
    },
    render: function(el) {
        var me = this;
        var container = me.__templates.select.clone();
        this.element = container;
        el.append(container);
        var selections = [{
            id: "singleColor",
            title: this.loc.datacharts.selectClr
        }, {
            id: "mapClr",
            title: this.loc.datacharts.clrFromMap
        }];
        var dropdownOptions = {
            placeholder_text: this.loc.datacharts.chooseColor,
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: "locale.panels.newSearch.noResults",
            width: '100%'
        };
        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var dropdown = select.create(options, dropdownOptions);
        dropdown.css({
            width: '100%'
        });
        select.adjustChosen();
        select.selectFirstValue();
        me._select = select;
        select.setValue("mapClr");

        var titleEl = me.__templates.title.clone();
        titleEl.text(title);
        container.append(titleEl);
        container.append(dropdown);
        //update color based on selection
        container.on('change', function(evt) {
            evt.stopPropagation();
            // FIXME: trigger an event to notify the parent of this compnonent?
            var colors = '#DC143C';
            if (select.getValue() === 'mapClr') {
                colors = me.getColorScale();
            }
            me.getChartInstance().redraw(null, {
                colors: colors
            });
        });
    }
});