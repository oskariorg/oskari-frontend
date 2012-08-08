/**
 *
 * A Copy As IS of the very first Oskari Proof of Concept Bundle
 * 
 * an application bundle
 * 
 * bundle consists of three  parts: 
 * - bundle
 * - bundle_instance
 * - ui
 * 
 * bundle lifecycle installed resolved instantiated (1-n times) started/stopped
 * removed / uninstalled
 * 
 * bundle instance lifecycle start -> started stop -> stopped
 * 
 */

/**
 * UI for this Bundle Instance
 * 
 * @class Oskari.mapframework.bundle.PositionInfoUI
 * 
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PositionInfoUI",
		function(libs) {
			this.libs = libs;
			this.form = null;
			this.ui = null;
		}, {
			get : function() {
				return this.form;
			},

			/**
			 * create UI with the provided libraries
			 */
			create : function() {
				var xt = this.libs.ext;

				var fldN = xt.create('Ext.form.field.Text', {
					fieldLabel : 'N',
					name : 'fldN'
				});
				var fldE = xt.create('Ext.form.field.Text', {
					fieldLabel : 'E',
					name : 'fldE'
				});

				this.ui = {
					'N' : fldN,
					'E' : fldE
				};

				var form = new xt.create('Ext.form.Panel', {
					title : 'Simple Form with FieldSets',
					labelWidth : 75,
					frame : true,
					bodyStyle : 'padding:5px 5px 0',
					width : 550,
					
					layout : 'column',
					defaults : {
						bodyPadding : 4
					},
					items : [ {

						xtype : 'fieldset',
						columnWidth : 1.0,
						title : 'Fieldset 1',
						collapsible : true,
						defaultType : 'textfield',
						defaults : {
							anchor : '100%'
						},
						layout : 'anchor',
						items : [ fldN, fldE ]
					} ]
				});

				this.form = form;
				return form;
			},
			/*
			 * move data to UI
			 */
			updateLocationInfo : function(n, e) {
				if (!this.ui)
					return;

				this.ui.E.setValue(e);
				this.ui.N.setValue(n);

			}

		});
