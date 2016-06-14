// parses and shows indicator metadata/selectors
/* {
	"id": "5",
	"regionsets": [6, 7],
	"source": {
		"fi": "Terveyden ja hyvinvoinnin laitos (THL)",
		"sv": "Institutet för hälsa och välfärd (THL)",
		"en": "Institute for Health and Welfare (THL)"
	},
	"selectors": [{
		"id": "sex",
		"allowedValues": ["male", "female", "total"]
	}, {
		"id": "year",
		"allowedValues": ["1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"]
	}],
	"description": {
		"fi": "Indikaattori ilmaisee kalenterivuoden aikana toimeentulotukea saaneiden 25-64-vuotiaiden osuuden prosentteina vastaavanikäisestä väestöstä. Väestötietona käytetään vuoden viimeisen päivän tietoa.<br /><br />Vuodesta 1991 lähtien tiedonkeruussa on kysytty viitehenkilön lisäksi myös puolison henkilötunnusta eli sukupuolittaiset tiedot saadaan vuodesta 1991alkaen. Viitehenkilöllä tarkoitetaan henkilöä, joka pääasiallisesti vastaa kotitalouden toimeentulosta.<p id=suhteutus>Väestösuhteutus on tehty THL:ssä käyttäen Tilastokeskuksen Väestötilaston tietoja.<\/p>",
		"sv": "Indikatorn visar den procentuella andelen 25-64-åriga mottagare av utkomststöd under kalenderåret av befolkningen i samma ålder (31.12).<p id=suhteutus>THL har relaterat uppgifterna till hela befolkningen på basis av uppgifterna i statistikcentralens befolkningsstatistik.<\/p>",
		"en": "The indicator gives the percentage of those who have received social assistance during the calendar year in the 25-64 age group. Population figures refer to the last day of the year. Since 1991, data have been collected on the spouse's personal identity code in addition to that of the reference person. In other words, data broken down by sex are available from 1991 onwards. Reference person is the person primarily responsible for the economic support of the household.<p id=suhteutus>Population proportions are calculated at THL based on the Population Statistics of Statistics Finland.<\/p>"
	},
	"name": {
		"fi": "Toimeentulotukea saaneet 25 - 64-vuotiaat, % vastaavanikäisestä väestöstä",
		"sv": "25-64-åriga mottagare av utkomststöd, % av befolkningen i samma ålder",
		"en": "Social assistance recipients aged 25-64, as % of total population of same age"
	},
	"public": true
}
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorParameters', function(sandbox) {
	this.sb = sandbox;
	this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
}, {
	__templates : {
		main : _.template('<div class="stats-ind-params"></div>'),
		select : _.template('<div><label>${name}<select name="${name}" class="${clazz}"></select></label></div>'),
		option : _.template('<option value="${id}">${name}</option>'),
		data : _.template('<div><label style="font-weight:bold;">${name}</label><span style="display: inline-block; float: right; clear:both;">${data}</span></div>')
	},
	clean : function() {
		if(!this.container) {
			return;
		}
		this.container.remove();
		this.container = null;
	},
	addMetadata : function(el, label, value) {
		if(!value) {
			// Nothing to show
			return;
		}
		el.append(this.__templates.data({
			name : label,
			data : value
		}));
	},
	indicatorSelected : function(el, datasrc, indId) {
		var me = this;
		this.clean();
		var cont = jQuery(this.__templates.main());
		this.container = cont;
		el.append(cont);
		var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
        spinner.insertTo(cont);
        spinner.start();

		this.service.getIndicatorMetadata(datasrc, indId, function(err, indicator) {
			if(err) {
				// notify error!!
				return;
			}
			// show description for indicator
			me.addMetadata(cont, 'Name', Oskari.getLocalized(indicator.name));
			me.addMetadata(cont, 'Source', Oskari.getLocalized(indicator.source));
			me.addMetadata(cont, 'Description', Oskari.getLocalized(indicator.description));
			// usable regions sets
			var availableSets = me.service.getRegionsets(indicator.regionsets);
			var regionsValue = _.map(availableSets, function(item) {
									return item.name;
								}).join(', ');
			if(!regionsValue) {
				regionsValue = 'No regions available for dataset';
			}
			cont.append(me.__templates.data({
				name : 'Regionsets',
				data : regionsValue
			}));
			// selections
			var selections = [];
			indicator.selectors.forEach(function(selector) {
				var select = me.__templates.select({
					name : selector.id,
					clazz : 'stats-select-param-' + selector.id
				});
				cont.append(select);
				var jqSelect = cont.find('.stats-select-param-' + selector.id);
				selector.allowedValues.forEach(function(val) {
					var opt = me.__templates.option({
						id : val,
						name : val
					});
					jqSelect.append(opt);
				});
				jqSelect.chosen({
					disable_search_threshold: 10
				});
				selections.push(jqSelect);
			});

			var btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.AddButton');
			btn.setHandler(function() {
				var values = {
					datasource : datasrc,
					indicator : indId,
					selections : {}
				};
				selections.forEach(function(select) {
					values.selections[select.attr('name')] = select.val()
				});
				me.service.getStateService().addIndicator(datasrc, indId, values.selections);
			});
			btn.insertTo(cont);
            spinner.stop();
		});
	}
});