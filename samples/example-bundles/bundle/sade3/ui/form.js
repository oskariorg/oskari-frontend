Oskari.clazz
		.define(
				'Oskari.poc.sade3.SadeFormView',
				function(ui) {

					this.component = null;

					this.ui = ui;

					this.tabs = {};

					this.grids = {};

					this.fields = {};
					
					this.modhost = {};

				},
				{

					samples : [ [ '17842000070103', '17842000070103' ],

					[ '09101700160001', '09101700160001' ] ],

					/**
					 * 
					 */
					createFields : function(ui, loc) {
						var sandbox = ui.getApp().getSandbox();
						

						var listeners = {
			                focus : function(evt) {
			                    sandbox.request("SearchModule", sandbox
			                    .getRequestBuilder('DisableMapKeyboardMovementRequest')());
			                },
			                /** when focus lost */
			                blur : function(evt) {
			                    sandbox.request("SearchModule", sandbox
			                    .getRequestBuilder('EnableMapKeyboardMovementRequest')());
			                }
			            };
					
						this.fields.tf_CU_identifier = Ext
								.create(
										'Ext.form.field.Text',
										{

											xtype : 'textfield',

											fieldLabel : '( 91-17-16-1 )',

											name : 'cuidentifier',

											anchor : '95%',

											allowBlank : false,

											value : '',

											store : this.samples,

											typeAhead : true,

											forceSelection : true,

											triggerAction : 'all',

											emptyText : 'Kiinteistötunnus...',

											selectOnFocus : true,
											
											listeners : listeners
											

										});

						this.fields.tf_CU_name = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Nimi',

									name : 'cuname',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_registered = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Rekisteröintipvm',

									name : 'curegistered',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_type = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Rekisteriyksikkölaji',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_area_land = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Maapinta-ala',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_CU_area_sea = Ext.create(
								'Ext.form.field.Text', {

									xtype : 'textfield',

									fieldLabel : 'Vesipinta-ala',

									name : 'cutype',

									anchor : '95%',

									value : '',

									disabled : true

								});

						this.fields.tf_address = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Katunimi',

									name : 'address',

									allowBlank : false,

									value : '',
									
									listeners : listeners

								});

						this.fields.tf_address_no = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Katunumero',

									name : 'address_no',

									allowBlank : false,

									value : '',
									
									listeners : listeners

								});

						this.fields.tf_postalcode = Ext.create(
								'Ext.form.field.Text', {

									fieldLabel : 'Postinumero',

									name : 'zipcode',

									disabled : true,

									value : '',

									allowBlank : false

								});

					},

					/**
					 * 
					 */
					createTab1 : function(ui, loc) {
						var me  = this;
						return Ext.create('Ext.form.Panel', {

							anchor : '100% 15%',

							region : 'center',

							labelAlign : 'top',

							title : 'Perustiedot',

							layout : 'column',


							border : false,

							items : [ {

								columnWidth : .35,

								border : false,

								items : [ Ext.create('Ext.form.field.Text', {

									fieldLabel : 'Henkilötunnus',

									allowBlank : false,

									disabled : true

								}), {

									border : false,

									html : '(Ei WFS -palvelua)'

								} ]

							}, {

								columnWidth : .35,

								border : false,

								items : [ Ext.create('Ext.form.field.Text', {

									fieldLabel : 'Nimi',

									disabled : true

								}) ]

							}, {

								columnWidth : .3,

								border : false,

								items : [ {

									xtype : 'button',

									text : 'Tallenna',

									handler : function() {

										alert('OK');

									}

								}, {

									xtype : 'button',

									text : 'Tyhjennö',

									handler : function() {

										me.reset();

										ui.getApp().getWorker().reset();

										ui.getApp().getMediator().reset();

									}
								} ]

							} ]

						});
					},

					/**
					 * 
					 */
					createTab2 : function(ui, loc) {
						var me  = this;
						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						return Ext
								.create(
										'Ext.form.Panel',

										{
											bodyFrame : false,
											bodyCls : 'formpart',

											anchor : '100% 30%',

											region : 'north',
											height: 256,

											labelAlign : 'top',

											title : 'Rekisteriyksikön tietoja',


											layout : 'column',

											border : false,

											items : [

													{

														columnWidth : .66,

														border : false,

														items : [
																tf_CU_identifier,
																tf_CU_registered,

																tf_CU_type,tf_CU_name,
																tf_CU_area_land,

																tf_CU_area_sea ]

													},

													{

														columnWidth : .33,

														border : false,

														items : [
{

	xtype : 'button',

	text : 'Valitse kartalta',

	handler : function() {
		var mapLayerId  = ui.getApp().getLayerManager().highlightMapLayer();

	}

},

																{

																	xtype : 'button',

																	text : 'Hae sijaintitiedot',

																	handler : function() {

																		ui

																				.getApp()

																				.getWorker()

																				.searchAnyByCUQualifiedIdentifier(

																						tf_CU_identifier

																								.getValue(),

																						{

																							zoomToExtent : true

																						});

																	}

																},

																{

																	xtype : 'button',

																	text : 'Hae kiinteistörekisteriote',

																	handler : function() {

																		var identifier = tf_CU_identifier

																				.getValue();

																		if (!identifier

																				|| identifier == '')

																			return;

																		var docresourcesourceurl = 'http://kb109.nls.fi:4021/cocoon-2.1.8/rekisteriotepalvelu/tietovarasto/palvelu/rekisteriote/kiinteistorekisterin_tietoja/tuloste.pdf?kiinteistotunnus=' + identifier;

																		var win = window

																				.open(

																						docresourcesourceurl,

																						'name',

																						'height=640,width=640,resizable=yes');

																		/*
																		 * if
																		 * (window.focus &&
																		 * win.focus) {
																		 * win
																		 * .focus(); }
																		 */

																	}

																},

																{

																	border : false,

																	html : '<a href="http://sosuli.nls.fi/catalogue/ui/index.html?queryType=instancesByCompositionExternalId&cxid=9fa9e554-93dc-4789-bab6-7c7728c10298" target="_blank">KTJkii WFS-palvelun Skeema</a>'

																}

														]

													} ]

										});

					},

					/**
					 * 
					 */
					createTab3 : function(ui, loc) {
						var me  = this;
						
						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						return Ext
								.create(
										'Ext.form.Panel',

										{

											bodyFrame : false,
											bodyCls : 'formpart',
												
											anchor : '100% 40%',

											region : 'center',

											labelAlign : 'top',

											title : 'Rakennuksen Osoitetiedot',

											layout : 'column',

											border : false,

											items : [

													{

														columnWidth : .66,

														border : false,

														items : [ tf_address,
																tf_address_no,
																tf_postalcode
														]

													},

													{

														columnWidth : .33,

														border : false,

														items : [
																{

																	xtype : 'button',

																	text : 'Hae tiedot (WFS)',

																	handler : function() {

																		ui

																				.getApp()

																				.getWorker()

																				.searchCUByBuildingAddress(

																						tf_address

																								.getValue(),

																						tf_address_no
																								.getValue(),

																						tf_postalcode
																								.getValue(),

																						{

																							zoomToExtent : false

																						});

																	}

																},
																{

																	border : false,

																	html : 'Maastotietokannassa ei ole kiinteistötunnusta, joten linkitys kiinteistörekisteriin sijainnin perusteella'

																/*
																 * // html : '<a //
																 * href="http://jkorhonen.nls.fi/testaus/PORTTI-Luettelopalvelu/index.html?queryType=instancesByCompositionExternalId&cxid=14a4161d-dab2-49d5-8d0a-101c0d4727dd" //
																 * target="_blank">Rakennustietojen<br // /> //
																 * WFS-palvelun
																 * Skeema</a>'
																 */

																} ]

													} ]

										});

					},
					
					
					createModulesHostPanel : function(ui) {
						 return Ext.create('Ext.tab.Panel',{
							 region: 'center',							 
							 items : [] });
					},
					
					getModulesHost: function() {
						return this.modhost;
					},

					/**
					 * 
					 */
					createView : function(ui) {

						var loc = ui.getLocale().get('app', 'map');

						this.createFields(ui);

						this.grids['RakennuksenOminaisuustiedot'] = this
								.createGrid(ui);

						// this.tabs['tab1'] = this.createTab1(ui, loc);
						this.tabs['tab2'] = this.createTab2(ui, loc);
						this.tabs['tab3'] = this.createTab3(ui, loc);

						var me = this;
						
						var modhost = this.createModulesHostPanel(ui);
						this.modhost = modhost;
						
						modhost.add(this.tabs['tab2']);
						

						var extendedInfosLayout =
							 Ext
								.create(
										'Ext.panel.Panel',
										{
											
											title : 'Rakennustiedot',
											region : 'south',
											layout : 'anchor',
											align : 'stretch',
											items: [this.tabs.tab3,
											        this.grids['RakennuksenOminaisuustiedot']]
										});
						
						modhost.add(extendedInfosLayout);
						
						var formLayout =
							 Ext
								.create(
										'Ext.panel.Panel',
										{
											/* title : 'Lomake', */
											region : 'center',
											layout : 'border',
											items : [
											        /* this.tabs.tab2, */
													modhost
											],
											bodyBorder : false,
											border : 0,
											bodyCls : 'webformcontainer'


										})

						this.component = Ext
								.create(
										'Ext.panel.Panel',
										{
											layout : 'border',
											height : 600,
											width : 500,
											bodyBorder : false,
											border : 0,
											bodyCls : 'formpart',

											items : [formLayout ],

											bbar : [ {
												xtype: 'button',
												text: 'Lähetä lomake',
												handler: function() {
												Ext.MessageBox.show( {
													title : 'Tallennetaan',
													msg : '...',
													progressText : '...',
													width : 300,
													progress : true,
													closable : false,
													icon : 'logo',
													modal : false
												});
												window.setTimeout(function() {
													Ext.MessageBox.hide();
												},500);
												}
											},{
												xtype: 'button',
												text: 'Sulje lomake',
												handler: function()  {
													ui.hideUserInterface();
												}
											},
												Ext.create(
													'Ext.ProgressBar', {
														width : 256

													}) ]

										});

						return this.component;

					},

					/**
					 * 
					 */
					reset : function() {

						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						tf_CU_identifier.setValue('');

						tf_CU_name.setValue('');

						tf_CU_registered.setValue('');

						tf_CU_type.setValue('');

						tf_CU_area_land.setValue('');

						tf_CU_area_sea.setValue('');

						tf_address.setValue('');

						tf_address_no.setValue('');

						tf_postalcode.setValue('');
						
						
						this.grids['RakennuksenOminaisuustiedot'].getStore().removeAll();

					},

					/**
					 * 
					 */
					setAddress : function(atts) {

						var tf_address = this.fields.tf_address;

						var tf_address_no = this.fields.tf_address_no;

						var tf_postalcode = this.fields.tf_postalcode;

						tf_address.setValue(atts.katunimi || '');

						tf_address_no.setValue(atts.katunumero || '')

						tf_postalcode.setValue(atts.postinumero || '');

					},

					/**
					 * 
					 */
					setCU : function(atts) {

						var tf_CU_identifier = this.fields.tf_CU_identifier;

						var tf_CU_name = this.fields.tf_CU_name;

						var tf_CU_registered = this.fields.tf_CU_registered;

						var tf_CU_type = this.fields.tf_CU_type;

						var tf_CU_area_land = this.fields.tf_CU_area_land;

						var tf_CU_area_sea = this.fields.tf_CU_area_sea;

						tf_CU_identifier.setValue(atts.kiinteistotunnus);

						tf_CU_name.setValue(atts.nimi);

						tf_CU_registered.setValue(atts.rekisterointipvm);

						tf_CU_type.setValue(atts.rekisteriyksikkolaji);

						tf_CU_area_land.setValue(atts.maapintaala);

						tf_CU_area_sea.setValue(atts.vesipintaala);

					},

					/**
					 * 
					 */
					createGrid : function(ui) {

						return Ext.create('Ext.grid.Panel', {
							bodyBorder : false,
							border : 0,
							bodyCls : 'formpart',
							autoScroll : true,

							stripeRows : true,

							anchor : '100% 60%',

							title : 'Rekisteriyksikön rakennustiedot',

							viewConfig : {

								forceFit : true

							},

							store : ui.getApp().getMediator().getStore(

							'RakennuksenOminaisuustiedot'),

							columns : [ {

								header : 'rakennustunnus',

								dataIndex : 'rakennustunnus'

							}, {

								hidden : true,

								header : 'kiinteistotunnus',

								dataIndex : 'kiinteistotunnus'

							},

							{

								hidden : true,

								header : 'tarkistusmerkki',

								dataIndex : 'tarkistusmerkki'

							}, {

								header : 'rakennusnumero',

								dataIndex : 'rakennusnumero'

							}, {

								header : 'luontiAika',

								dataIndex : 'luontiAika'

							}, {

								header : 'muutosAika',

								dataIndex : 'muutosAika'

							},

							{

								header : 'tilanNimi',

								dataIndex : 'tilanNimi'

							}, {

								hidden : true,

								header : 'kiinteistoyksikonMaaraalatunnus',

								dataIndex : 'kiinteistoyksikonMaaraalatunnus'

							}, {

								hidden : true,

								header : 'syntymahetkenRakennustunnus',

								dataIndex : 'syntymahetkenRakennustunnus'

							}, {

								hidden : true,

								header : 'postinumero',

								dataIndex : 'postinumero'

							},

							{

								hidden : true,

								header : 'rakennustunnuksenVoimassaolo',

								dataIndex : 'rakennustunnuksenVoimassaolo'

							},

							{

								hidden : true,

								header : 'valmistumispaiva',

								dataIndex : 'valmistumispaiva'

							},

							{

								hidden : true,

								header : 'rakennuspaikanHallintaperuste',

								dataIndex : 'rakennuspaikanHallintaperuste'

							}, {

								hidden : true,

								header : 'kayttotarkoitus',

								dataIndex : 'kayttotarkoitus'

							}, {

								hidden : true,

								header : 'kaytossaolotilanne',

								dataIndex : 'kaytossaolotilanne'

							},

							{

								hidden : true,

								header : 'julkisivumateriaali',

								dataIndex : 'julkisivumateriaali'

							},

							{

								hidden : true,

								header : 'kerrosala',

								dataIndex : 'kerrosala'

							}, {

								hidden : true,

								header : 'kerrosluku',

								dataIndex : 'kerrosluku'

							}, {

								hidden : true,

								header : 'kokonaisala',

								dataIndex : 'kokonaisala'

							}, {

								hidden : true,

								header : 'tilavuus',

								dataIndex : 'tilavuus'

							},

							{

								hidden : true,

								header : 'lammitystapa',

								dataIndex : 'lammitystapa'

							}, {

								hidden : true,

								header : 'lammonlahde',

								dataIndex : 'lammonlahde'

							}, {

								hidden : true,

								header : 'rakennusmateriaali',

								dataIndex : 'rakennusmateriaali'

							}, {

								hidden : true,

								header : 'rakennustapa',

								dataIndex : 'rakennustapa'

							}, {

								hidden : true,

								header : 'sahko',

								dataIndex : 'sahko'

							}, {

								hidden : true,

								header : 'kaasu',

								dataIndex : 'kaasu'

							}, {

								hidden : true,

								header : 'viemari',

								dataIndex : 'viemari'

							}, {

								hidden : true,

								header : 'vesijohto',

								dataIndex : 'vesijohto'

							}, {

								hidden : true,

								header : 'lamminvesi',

								dataIndex : 'lamminvesi'

							}, {

								hidden : true,

								header : 'aurinkopaneeli',

								dataIndex : 'aurinkopaneeli'

							}, {

								hidden : true,

								header : 'hissi',

								dataIndex : 'hissi'

							}, {

								hidden : true,

								header : 'ilmastointi',

								dataIndex : 'ilmastointi'

							}, {

								hidden : true,

								header : 'saunojenLukumaara',

								dataIndex : 'saunojenLukumaara'

							}, {

								hidden : true,

								header : 'uimaaltaidenLukumaara',

								dataIndex : 'uimaaltaidenLukumaara'

							}, {

								hidden : true,

								header : 'vaestosuojanKoko',

								dataIndex : 'vaestosuojanKoko'

							}, {

								hidden : true,

								header : 'viemariliittyma',

								dataIndex : 'viemariliittyma'

							}, {

								hidden : true,

								header : 'vesijohtoliittyma',

								dataIndex : 'vesijohtoliittyma'

							}, {

								hidden : true,

								header : 'sahkoliittyma',

								dataIndex : 'sahkoliittyma'

							}, {

								hidden : true,

								header : 'kaasuliittyma',

								dataIndex : 'kaasuliittyma'

							}, {

								hidden : true,

								header : 'kaapeliliittyma',

								dataIndex : 'kaapeliliittyma'

							}, {

								hidden : true,

								header : 'poikkeuslupa',

								dataIndex : 'poikkeuslupa'

							}, {

								hidden : true,

								header : 'perusparannus',

								dataIndex : 'perusparannus'

							}, {

								hidden : true,

								header : 'perusparannuspaiva',

								dataIndex : 'perusparannuspaiva'

							},

							{

								hidden : true,

								header : 'sijaintiepavarmuus',

								dataIndex : 'sijaintiepavarmuus'

							}

							]

						});

					}

				});