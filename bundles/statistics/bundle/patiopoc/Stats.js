/**
 * @class Oskari.statistics.bundle.patiopoc.Stats
 * 
 * Q&D fixed from a demo
 *
 * todo: remove UI dependencies etc... cleanup
 * Work-in-Progress
 */
Oskari.clazz.define('Oskari.statistics.bundle.patiopoc.Stats', function(view) {
	this.statArray = [];
	this.statson = null;
	this.statId = 127;
	this.metasonId = null;
	this.indicatorList = "";
	this.indicatorArray = [];
	this.currentIndex = 0;
	this.resultArr = [];
	this.selected = null;
	this.classes = 5;
	this.colorsets = null;
	this.colorsetIndex = 5;
	this.currentColor = "#bcbcbc";
	this.reverse = false;
	this.was = "meta";
	this.table = {};

	this.els = {

	};
	this.view = view;
	this.instance = view.instance;

}, {

	appendTo : function(el) {
		var me = this;
		var elSel = jQuery('<div id="yearPicker"><br/><b>Vuosi</b><br/></div>');
		var elYearSelector = jQuery('<select id="year" size="4"></select>');
		var years = ["2008", "2009", "2010", "2011"];
		for(var n = 0; n < years.length; n++) {
			var opt = jQuery("<option />");
			opt.attr("value", "" + years[n]);
			opt.text("" + years[n]);
			opt.click(function() {
				me.getStatson();
			});
			elYearSelector.append(opt);
		}
		elSel.append(elYearSelector);

		el.append(elSel);

		var elCls = jQuery('<div id="classificationMethod"><br/><b>Luokittelutapa</b><br/>');
		var elClsSelector = jQuery('<select id="method" size="4"></select>');
		this.els.method = elClsSelector;
		elCls.append(elClsSelector);

		var opts = ["1", "2", "3"];
		for(var n = 0; n < opts.length; n++) {
			var opt = jQuery('<option />');
			opt.attr('value', opts[n]);
			
			opt.click(function() {
				me.getSLDURL(jQuery(this).attr('value'), me.classes);
			});
			opt.text("Luonnolliset luokat");
			elClsSelector.append(opt);
		}

		this.els.indicatorList = jQuery('<div id="indicatorList" />');
		el.append(this.els.indicatorList);

		this.els.attrs = jQuery('<div id="attrs"></div>');
		el.append(this.els.attrs);
		this.els.datas = jQuery('<div id="datas"></div>');
		el.append(this.els.datas);

		this.kunnat_kevyt = new OpenLayers.Layer.Vector('WFS', {

		});

		/* http://tiaarnio.nls.fi/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName=Kunnat_kevyt&*/
		var protocol = new OpenLayers.Protocol.WFS({
			version : '1.1.0',
			url : "Kunnat_kevyt.xml", //"http://tiaarnio.nls.fi/geoserver/paikkatilastoikkuna/wfs",
			featureType : "Kunnat_kevyt",
			geometryName : 'geom',
			srsName : 'EPSG:3067',
			featureNS : "http://tiaarnio.nls.fi",
			featurePrefix : "paikkatilastoikkuna"
		});

		protocol.rx = function(options) {
			OpenLayers.Protocol.prototype.read.apply(this, arguments);
			options = OpenLayers.Util.extend({}, options);
			OpenLayers.Util.applyDefaults(options, this.options || {});
			var response = new OpenLayers.Protocol.Response({
				requestType : "read"
			});

			var data = OpenLayers.Format.XML.prototype.write.apply(this.format, [this.format.writeNode("wfs:GetFeature", options)]);

			response.priv = OpenLayers.Request.GET({
				url : options.url,
				callback : this.createCallback(this.rrx, response, options),
				params : options.params,
				headers : options.headers,
				data : data
			});

			return response;
		};

		protocol.rrx = function(response, options) {
			console.log("RRX", response, this.format, this.readFormat);
			this.handleRead(response, options);
			console.log("RRX post read", response);
			me.fillTable(response);
			me.getIndicators();
		};
		var response = protocol.rx({
			maxFeatures : 750,
			callback : function(e) {
				/*		me.fillTable(e);
				 me.getIndicators();*/
			}
		});

		var colors = new OpenLayers.Request.GET({
			url : "raindancer.json", //"http://tiaarnio.nls.fi/kuntaproto/raindancer.php",
			params : {
				collection : 'json'
			},
			callback : function(e) {
				me.setColors(e);
			}
		});

	},
	/**
	 * @method getStatson
	 */
	getStatson : function(id, year, gender) {
		var me = this;
		if(id)
			this.statId = id;
		else
			var id = this.statId;
		if(!year)
			var year = me.getSelectedYear();
		if(!gender)
			var gender = "total";

		var me = this;
		var stat = new OpenLayers.Request.GET({
			url : "csv2json.json", //"http://tiaarnio.nls.fi/sotkaproto/csv2json.php",
			params : {
				indicator : id,
				years : year,
				genders : gender
			},
			callback : function(getresp) {
				me.fillStatson(getresp);
			}
		});

	},
	/**
	 * @method fillStatson
	 */
	fillStatson : function(getresp) {
		var me = this;
		this.statson = JSON.parse(getresp.responseText);
		// if the requested statistics was empty
		if(this.statson.length == 0) {
			alert("Tilastoa ei voida näyttää kartalla");
			return;
		}
		var s;
		this.statArray = [];
		for(s in this.statson)
		if(this.statson[s].hasOwnProperty) {
			this.statArray.push(parseFloat(this.statson[s][0]));
			/*this.table[s].arvo = parseFloat(this.statson[s][0]);*/
		}
		// if(statArray.length<336) console.log("Less than 336 results");
		this.getSLDURL(null, this.classes);
		this.getMetadata();
	},
	getMethod : function() {
		var e;
		e = this.els.method.get()[0];
		if(e.selectedIndex == -1)
			return 1;
		else
			return parseInt(e.options[e.selectedIndex].value);
	},
	/**
	 * @method getSLDURL
	 * classify and get a new URL for the SLD
	 */
	getSLDURL : function(method, classes) {
		var me = this;
		var gstats = new geostats(this.statArray);
		var c, i, limits;
		var check = false;
		var strings = [];
		// var dbg = 0;

		if(!method || method == 0)
			method = me.getMethod();
		if(!classes || classes == 0)
			classes = parseInt(document.getElementById("cc").innerHTML);
		for( i = 0; i < classes; i++)
		strings[i] = [];

		if(method == 1)
			limits = gstats.getJenks(classes);
		if(method == 2)
			limits = gstats.getQuantile(classes);
		if(method == 3)
			limits = gstats.getEqInterval(classes);

		for(c in this.statson)
		if(this.statson[c].hasOwnProperty) {
			for( i = 0; i < strings.length; i++) {
				if(parseFloat(this.statson[c][0]) >= limits[i] && parseFloat(this.statson[c][0]) < limits[i + 1]) {
					strings[i].push(c);
					// dbg++;
					check = true;
					break;
				}
				// a special case for when there's only one child in the last class (the low limit and up limit are the same)
				if(parseFloat(this.statson[c][0]) == limits[i] && parseFloat(this.statson[c][0]) == limits[i + 1]) {
					strings[i].push(c);
					check = true;
					break;
				}

			}
			if(check) {
				check = false;
				continue;
			}
			strings[strings.length - 1].push(c);
			// console.log("value :"+ parseFloat(statson[c][0]) + " put to the last class!");
		}

		// empty the table from old values
		for( i = 0; i < this.kunnat_kevyt.features.length; i++) {
			document.getElementById(i).lastChild.innerHTML = "&nbsp;";
		}

		// put the results to the table
		for(c in this.statson)
		if(this.statson[c].hasOwnProperty) {
			/*document.getElementById('k' + c).innerHTML = this.statson[c][0];*/
		}

		// news:
		/*this.table.sort(sorter('arvo', false, parseFloat));*/
		document.getElementById("datas").innerHTML = "";
		for(c in this.table)
		if(table[c].hasOwnProperty) {
			document.getElementById("datas").innerHTML += '<div id="m' + c + '">' + this.table[c].nimi + ' : ' + this.table[c].arvo + '</div><br>';
		}

		var tmpArr = [];

		for( i = 0; i < strings.length; i++)
		tmpArr.push(strings[i].join(","));
		var classString = tmpArr.join("|");

		var colors = this.colorsets[this.colorsetIndex][this.classes - 3];

		var colorArr = colors.split(",");

		this.currentColor = '#' + colorArr[0];
		/*document.getElementById("mover").style.backgroundColor = currentColor;*/
		if(this.reverse) {
			colorArr.reverse();
			colors = colorArr.join(",");
		}
		for( i = 0; i < colorArr.length; i++)
		colorArr[i] = '#' + colorArr[i];
		gstats.setColors(colorArr);

		var sldurl = "http://tiaarnio.nls.fi/sotkaproto/lib/sldgen/sldgen.php?name=tilastoalueet:kunnat2013&attr=kuntakoodi&classes=" + classString + "&vis=choro:" + colors;

		/*kunnat.mergeNewParams({ SLD: sldurl });*/
		var sandbox = this.instance.getSandbox();

		var layerParameters = {
			FORMAT_OPTIONS : "antialias%3Aon",
			SLD : sldurl
		};
		sandbox.requestByName(me.instance, 'MapModulePlugin.MapLayerUpdateRequest', ['999', true, layerParameters]);

		/*document.getElementById("classification").style.display = "block";
		document.getElementById("option0").innerHTML = gstats.getHtmlLegend(null, "", true, legendRounder);*/

	},
	getSelectedYear : function() {
		var me = this;
		var e;
		e = document.getElementById("year");
		if(e.selectedIndex == -1)
			return 2011;
		else
			return parseInt(e.options[e.selectedIndex].value);
	},
	getMetadata : function() {
		var me = this;
		// skip if metadata already acquired
		if(this.metasonId == this.statId)
			return;

		var stat = new OpenLayers.Request.GET({
			url : "http://tiaarnio.nls.fi/sotkaproto/jsonproxy.php",
			params : {
				id : this.statId
			},
			callback : function(e) {
				me.fillMetadiv(e);
			}
		});
	},
	fillMetadiv : function(e) {

		// dbg = e;
		var metason = JSON.parse(e.responseText);
		// if the requested metadata was empty
		if(metason.length == 0) {
			alert("Metatietoja ei löytynyt");
			return;
		}
		this.metasonId = this.statId;
		// console.log(metason);

		this.toggle(0, 1);
		document.getElementById("metatext").innerHTML = metason.description.fi;
		document.getElementById("organization").innerHTML = metason.organization.title.fi;
	},
	toggle : function(elementShow, elementHide) {
		var elements = ["meta", "indicators"]
		document.getElementById(elements[elementHide]).style.display = "none";
		document.getElementById(elements[elementShow]).style.display = "block";
	},
	// get the list of available indicators
	getIndicators : function() {
		var me = this;
		// skip if already done
		if(this.indicatorList != "") {
			console.log("skipped indicator request");
			return;
		}

		var indicators = new OpenLayers.Request.GET({
			url : "indicators.json", //http://tiaarnio.nls.fi/sotkaproto/jsonproxy.php",
			callback : function(e) {
				me.fillIndicators(e);
			}
		});
	},
	fillIndicators : function(e) {
		var me = this;
		var i;
		var indicators = JSON.parse(e.responseText);
		// if the response was empty
		if(indicators.length == 0) {
			alert("Indikaattoreita ei löytynyt");
			return;
		}
		// console.log(indicators);
		this.indicatorList = indicators;
		for( i = 0; i < this.indicatorList.length; i++) {
			this.indicatorArray.push(this.indicatorList[i]);
		}
		var elIndicatorList = this.els.indicatorList;

		for( i = 0; i < 10; i++) {

			var elIndicator = 
				jQuery('<div class="idContainer">' + indicators[i].title.fi + '<span class="geostats-legend-counter"> (id: ' + indicators[i].id + ')</span>' + "</div>");
			elIndicator.attr('indicator',indicators[i].id);
			elIndicator.click(function() {
				var indie = jQuery(this).attr('indicator');
				me.getStatson(indie);
			});
			elIndicatorList.append(elIndicator);
		}
		this.currentIndex = 10;
	},
	fillTable : function(resp) {

		// this nifty inline-function-thingy sorts the features by kuntakoodi
		// kunnat_kevyt.features.sort(function(a,b) { return (a.data.kuntakoodi > b.data.kuntakoodi) ? 1 : ((b.data.kuntakoodi > a.data.kuntakoodi) ? -1 :0); });

		// sort alphabetically
		this.kunnat_kevyt.features.sort(function(a, b) {
			return (a.data.kunta > b.data.kunta) ? 1 : ((b.data.kunta > a.data.kunta) ? -1 : 0);
		});
		var tmpstring, i, feature;
		feature = {};
		tmpstring = '<table class="data">';

		for( i = 0; i < this.kunnat_kevyt.features.length; i++) {

			table[this.kunnat_kevyt.features[i].data.kuntakoodi] = {
				"kuntakoodi" : this.kunnat_kevyt.features[i].data.kuntakoodi,
				"feature" : i,
				"nimi" : this.kunnat_kevyt.features[i].data.kunta,
				"arvo" : ""
			};
			tmpstring += '<tr id="' + i + '" onMouseOver="highlightFeature(' + i + ');" onMouseOut="unhighlightFeature(' + i + ');">';
			tmpstring += '<td><a name="' + this.kunnat_kevyt.features[i].data.kuntakoodi + '">' + this.kunnat_kevyt.features[i].data.kunta + '</a></td>';
			tmpstring += '<td id="k' + this.kunnat_kevyt.features[i].data.kuntakoodi + '">&nbsp;</td>';
			tmpstring += '</tr>';

			// tmpList.push(parseInt(kunnat_kevyt.features[i].data.kuntakoodi));
			this.kunnat_kevyt.features[i].data.id = i;
			this.kunnat_kevyt.features[i].attributes.id = i;

		}
		tmpstring += '</table>';
		document.getElementById('attrs').innerHTML = tmpstring;
		document.getElementById('attrs').style.display = 'block';
	},
	setColors : function(request) {
		this.colorsets = JSON.parse(request.responseText);
		this.updateColormenu();
	},
	updateColormenu : function() {

	}
});
