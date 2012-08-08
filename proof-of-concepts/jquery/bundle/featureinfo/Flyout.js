/**
 * @class Oskari.poc.yuilibrary.featureinfo.Flyout
 */
Oskari.clazz.define('Oskari.poc.jquery.featureinfo.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.templateRow = null;
	this.templateCell = null;
	this.state = null;
	this.yuilibrary = null;
}, {
	getName : function() {
		return 'Oskari.poc.jquery.featureinfo.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = el[0];
		// ?
	},
	startPlugin : function() {
		this.template = $('<table id="samitest" class="featureTypeGrid"></table>');
		this.templateRow = $('<tr></tr>');
		this.templateCell = $('<td></td>');
	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return "Taulukko JQuery";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();
		jQuery(me.container).empty();
		var data = [];
		for(var t = 0; t < 250; t++) {
			data.push({
				id: t,
				name : 'sami' + t
			});
		}
			
		var table = jQuery(me.template).clone();
		table.append("<thead><tr><th>id</th><th>name</th></tr></thead>");

		for(var i = 0, len = data.length; i < len; ++i) {
			
			var row = jQuery(me.templateRow).clone();
			
			row.append(jQuery(me.templateCell).clone().append(data[i].id));
			row.append(jQuery(me.templateCell).clone().append(data[i].name));
			table.append(row);
		}
		jQuery(me.container).append(table);
		
		
		var oTable = jQuery('#samitest').dataTable({
			"oLanguage": {
				"sEmptyTable": "Tyhjä!",
				"sProcessing": "Ladataan...",
		        "sLengthMenu": "Näytä _MENU_ tietuetta/sivu",
		        "sZeroRecords": "ei löytynyt",
		        "sInfo": "Tietueet: _START_ - _END_ Yhteensä _TOTAL_ kpl",
		        "sInfoEmtpy": "Ei tietueita",
		        "sInfoFiltered": "(Rajattu/kaikkiaan _MAX_)",
		        "sInfoPostFix": "",
		        "sSearch": "Rajaus:",
		        "sUrl": "",
		        "oPaginate": {
	                "sFirst":    "  <<  ",
	                "sPrevious": "Edellinen",
	                "sNext":     "Seuraava",
	                "sLast":     "  >>  "
	            }
			}
		});
		
	    jQuery("#samitest tbody tr").live('click', function( e ) {
	        jQuery(this).toggleClass('row_selected');
	        /*if ( jQuery(this).hasClass('row_selected') ) {
	            jQuery(this).removeClass('row_selected');
	        }
	        else {
	            oTable.$('tr.row_selected').removeClass('row_selected');
	            jQuery(this).addClass('row_selected');
	        }
	        */
	        var anSelected = oTable.$('tr.row_selected');
	        console.dir(oTable.fnGetData());
	        //var nTds = $('td', this);
	        var index = -1;
	        if(anSelected.length > 0) {
	        	index = anSelected[0]._DT_RowIndex;
	        }
	        
	        if(index != -1) {
	        	var allRows = oTable.$('tr');
	        	console.dir(allRows[index]);
	        	console.log('rivimäärä: ' + allRows.length);
	        }
	    });
	     
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
