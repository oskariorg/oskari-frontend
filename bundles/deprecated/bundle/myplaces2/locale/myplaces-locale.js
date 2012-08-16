/**
 * @class Oskari.mapframework.bundle.myplaces.ui.module.Locale
 * Localization data for My Places bundle
 */
Oskari.clazz.define('Oskari.mapframework.bundle.myplaces.ui.module.Locale',

/**
 * @method create called automatically on construction
 * @static
 * @param lang 
 * 		current language ['fi'|'sv'|'en']
 */
function(lang) {
 this.lang = lang;
 this.loc = this.__locale[lang];
},{
  __locale: {
     'fi': {
        	// generic localization
        	title : 'Omat paikat <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Tallenna',
       		deleteConfirmTitle : 'Poistetaanko?',
        	loadmask : 'Ladataan...',
        	savemask : 'Tallennetaan...',
        	deletemask : 'Poistetaan...',
        	errorSave : 'Virhe tallennuksessa!',
        	errorDelete : 'Virhe poistossa!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'Toiminnolla voit tallentaa kohteita kartalle. Kohteet löytyvät Omat paikat -karttatasoilta. Aloita valitsemalla kohteen tyyppi:',
		        btnPoint : 'Lisää piste',
		        btnLine : 'Lisää reitti',
		        btnArea : 'Lisää alue',
        		drawHelp : {
        			point : 'Lisää piste klikkaamalla kartalla.',
        			line : 'Lisää viivan taitepiste klikkaamalla kartalla. Lopeta piirto tuplaklikkauksella tai painamalla "Lopeta piirto".',
        			area : 'Lisää alueen taitepiste klikkaamalla kartalla. Lopeta piirto tuplaklikkauksella tai painamalla "Lopeta piirto".'
        		},
        		btnCancelDraw : 'Keskeytä piirto',
        		btnFinishDraw : 'Lopeta piirto',
        		selectionHelp : 'Kohteen saat valittua muokattavaksi klikkaamalla sitä kartalla tai taulukossa.',
        		editHelp : {
			        point : 'Siirrä pistettä raahaamalla sitä kartalla.',
			        line : 'Muokkaa viivaa raahaamalla viivan taitepisteitä kartalla.',
			        area : 'Muokkaa muotoa raahaamalla reunaviivan taitepisteitä kartalla.',
			        desc : 'Muokkaa kohteen tietoja painamalla "Muokkaa" nappia.'
        		},
        		editSaveBtn : {
			        point : 'Tallenna sijainti',
			        line : 'Tallenna muoto',
			        area : 'Tallenna muoto'
        		},
        		btnEdit : 'Muokkaa',
        		deleteHelp : 'Valitun kohteen saat poistettua painamalla "Poista" nappia.',
        		btnDelete : 'Poista',
        		deleteConfirm : 'Paikan nimi: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Kohteen tiedot',
		        categoryLabel : 'Karttataso'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Lisää uusi karttataso',
		        editTip : 'Muokkaa karttatasoa',
		        cancelBtn : 'Sulje tallentamatta',
		        placeName : 'Nimi',
		        placeDesc : 'Kuvaus',
		        placeCreateDate : 'Kohde luotu',
		        placeUpdateDate : 'Kohde päivitetty',
		        errorNoName : 'Anna paikalle nimi',
		        errorCategoryNotSelected : 'Valitse karttataso tai anna uudelle karttatasolle nimi'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Poista karttataso',
		        lineColorLabel : 'Viivan tai reunaviivan väri',
		        fillColorLabel : 'Alueen täyttöväri',
		        lineWidthLabel : 'Viivan tai reunaviivan leveys',
		        dotSizeLabel : 'Pisteen koko',
		        dotColorLabel : 'Pisteen väri',
		        backBtn : 'Takaisin',
		        errorNoName : 'Anna karttatasolle nimi',
		        errorDeleteDefault : 'Oletuskarttatasoa ei voi poistaa'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Karttataso: "{0}". Sisältää paikkoja: {1} kpl.',
		        deleteConfirmMoveText : 'Haluatko siirtää paikat oletuskarttatasolle "{0}"?',
		        btnMove : 'Siirrä paikat ja poista karttataso',
		        btnDelete : 'Poista karttataso',
		        btnDeleteAll : 'Poista karttataso paikkoineen',
		        btnCancel : 'Peruuta'
        	},
        	
        	// grid panel
        	grid : {
        		title : 'Omat paikat <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Nimi',
		        placeDesc : 'Kuvaus',
		        linkHeader: 'Kohdistus',
		        linkValue: 'Näytä kohde',
		        type : {
		        	label :'Tyyppi',
		        	point : 'Piste',
		        	line : 'Viiva',
		        	area : 'Alue' 
		        },
		        createDate : 'Kohde luotu',
		        updateDate : 'Kohde päivitetty'
        	}
       },
     'sv' : {
        	// generic localization
        	title : 'Mina platser <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Spara',
       		deleteConfirmTitle : 'Radera?',
        	loadmask : 'Laddar...',
        	savemask : 'Lagrar...',
        	deletemask : 'Raderar...',
        	errorSave : 'Fel vid lagring!',
        	errorDelete : 'Fel vid radering!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'Du kan lagra objekt på kartan med funktionen "Mina platser". Objekten finns på kartlagren Mina platser. Börja genom att välja typen av objekt:',
		        btnPoint : 'Tillsätt punkt',
		        btnLine : 'Tillsätt rutt',
		        btnArea : 'Tillsätt område',
        		drawHelp : {
        			point : 'Tillägg en punkt genom att klicka på kartan.',
        			line : 'Tillägg en brytningspunkt på linjen genom att klicka på kartan. Sluta rita genom att dubbelklicka, eller klicka på knappen "Avsluta ritandet".',
        			area : 'Tillägg en brytningspunkt på området genom att klicka på kartan. Sluta rita genom att dubbelklicka, eller klicka på knappen "Avsluta ritandet".'
        		},
        		btnCancelDraw : 'Avbryt ritandet',
        		btnFinishDraw : 'Avsluta ritandet',
        		selectionHelp : 'Du kan bearbeta objektet genom att klicka det på kartan eller i tabellen.',
        		editHelp : {
			        point : 'Flytta på punkten genom att klicka och släpa det på kartan.',
			        line : 'Bearbeta rutten genom att klicka och släpa dess brytningspunkt på kartan.',
			        area : 'Bearbeta figuren genom att klicka och släpa kantlinjens brytningspunkter på kartan.',
			        desc : 'Bearbeta informationen om objektet genom att klicka på "Bearbeta".'
        		},
        		editSaveBtn : {
			        point : 'Spara läge',
			        line : 'Spara figur',
			        area : 'Spara figur'
        		},
        		btnEdit : 'Bearbeta',
        		deleteHelp : 'Radera det valda objektet genom att klicka på "Radera".',
        		btnDelete : 'Radera',
        		deleteConfirm : 'Platsens namn: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Information om objektet',
		        categoryLabel : 'Kartlager'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Tillägg ett kartlager',
		        editTip : 'Bearbeta kartlagret',
		        cancelBtn : 'Stäng utan att lagra',
		        placeName : 'Namn',
		        placeDesc : 'Beskrivning',
		        placeCreateDate : 'Objektet skapades',
		        placeUpdateDate : 'Objektet uppdaterades',
		        errorNoName : 'Namnge platsen',
		        errorCategoryNotSelected : 'Välj kartlager eller namnge ett nytt kartlager'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Radera kartlagret',
		        lineColorLabel : 'Linjens eller kantlinjens färg',
		        fillColorLabel : 'Områdets ifyllnadsfärg',
		        lineWidthLabel : 'Linjens eller kantlinjens bredd',
		        dotSizeLabel : 'Punktens storlek',
		        dotColorLabel : 'Punktens färg',
		        backBtn : 'Tillbaka',
		        errorNoName : 'Namnge kartlagret',
		        errorDeleteDefault : 'Det förvalda kartlagret kan inte raderas'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Kartlager: "{0}". Antal platser: {1}',
		        deleteConfirmMoveText : 'Vill du flytta platserna till det förvalda kartlagret "{0}"?',
		        btnMove : 'Flytta platserna och radera kartlagret',
		        btnDelete : 'Radera kartlagret',
		        btnDeleteAll : 'Radera kartlagret inkl. platserna',
		        btnCancel : 'Tillbaka'
        	},
        	
        	// grid panel
        	grid : {
        		title : 'Mina platser <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Namn',
		        placeDesc : 'Beskrivning',
		        linkHeader: 'Fokusering',
		        linkValue: 'Vis objekt',
		        type : {
		        	label :'Typ',
		        	point : 'Punkt',
		        	line : 'Linje',
		        	area : 'Område' 
		        },
		        createDate : 'Objektet skapades',
		        updateDate : 'Objektet uppdaterades'
        	}
      },
     'en' : {
        	// generic localization
        	title : 'My places <b style=\'color:#F4A529\'>BETA</b>',
        	saveBtn : 'Save',
       		deleteConfirmTitle : 'Delete?',
        	loadmask : 'Loading...',
        	savemask : 'Saving...',
        	deletemask : 'Deleting...',
        	errorSave : 'Error while saving!',
        	errorDelete : 'Error while deleting!',
        	
        	// main panel
        	mainpanel : {
		        myPlacesDesc : 'The function My places allows you to save objects on the map. ' +
		        			'Saved objects are stored in map layer group "My places". '+
		        			'Please start by selecting type of object:',
		        btnPoint : 'Add point',
		        btnLine : 'Add route',
		        btnArea : 'Add area',
        		drawHelp : {
        			point : 'Add a point by clicking on the map.',
        			line : 'Add a handle on the line by clicking on the map. ' + 
    					'Stop drawing by double-clicking or by clicking the button "Stop drawing".',
        			area : 'Add a handle on the boundary line of the area by clicking on the map. ' +
        				'Stop drawing by double-clicking or by clicking the button "Stop drawing".'
        		},
        		btnCancelDraw : 'Cancel drawing',
        		btnFinishDraw : 'Stop drawing',
        		selectionHelp : 'Start editing an object by clicking it on the map or in the table.',
        		editHelp : {
			        point : 'Move a point object by clicking and dragging it on the map.',
			        line : 'Move and edit a route object by clicking and dragging the line handles on the map.',
			        area : 'Move and edit an area object by clicking and dragging the boundary line handles on the map.',
			        desc : 'Edit object information by clicking the "Edit"-button.'
        		},
        		editSaveBtn : {
			        point : 'Save location',
			        line : 'Save shape',
			        area : 'Save shape'
        		},
        		btnEdit : 'Edit',
        		deleteHelp : 'Delete selected object by clicking the "Remove"-button.',
        		btnDelete : 'Delete',
        		deleteConfirm : 'Object name: '
        	},
        	
        	// generic wizard window localization
        	wizard : {
		        title : 'Object information',
		        categoryLabel : 'Map layer'
        	},
        	
        	// wizard my places panel
        	myplace : {
		        addTip : 'Add a new map layer',
		        editTip : 'Edit map layer',
		        cancelBtn : 'Close without saving',
		        placeName : 'Name',
		        placeDesc : 'Description',
		        placeCreateDate : 'Object created',
		        placeUpdateDate : 'Object updated',
		        errorNoName : 'Type object name',
		        errorCategoryNotSelected : 'Select a map layer or type the name of a new map layer'
        	},
        	
        	// wizard category panel
        	category : {
		        deleteTip : 'Delete map layer',
		        lineColorLabel : 'Colour of line or area boundary',
		        fillColorLabel : 'Fill colour of area',
		        lineWidthLabel : 'Width of line or area boundary',
		        dotSizeLabel : 'Point size',
		        dotColorLabel : 'Point colour',
		        backBtn : 'Back',
		        errorNoName : 'Type map layer name',
		        errorDeleteDefault : 'The default map layer cannot be deleted'
        	},
        	
        	// wizard category delete
        	confirm : {
		        deleteConfirm : 'Map layer: "{0}". Number of places: {1}.',
		        deleteConfirmMoveText : 'Do you want to move places to the default map layer "{0}"?',
		        btnMove : 'Move places and delete map layer',
		        btnDelete : 'Delete map layer',
		        btnDeleteAll : 'Delete map layer and its places',
		        btnCancel : 'Cancel'
        	},
        	
        	// grid panel
        	grid : {
		        title : 'My places <b style=\'color:#F4A529\'>BETA</b>',
		        placeName : 'Name',
		        placeDesc : 'Description',
		        linkHeader: 'Focus',
		        linkValue: 'Show object',
		        type : {
		        	label :'Type',
		        	point : 'Point',
		        	line : 'Line',
		        	area : 'Area' 
		        },
		        createDate : 'Object created',
		        updateDate : 'Object updated'
        	}
      }
  },
    /**
     * @method getCurrentLocale
     * Returns the localization data for current language
	 * @return {Object} JSON presentation of localization key/value pairs
     */
  getCurrentLocale: function()  {
     return this.loc;
  },
    /**
     * @method getLocale
     * Returns the localization data for requested language
	 * @param lang
	 * 		current language ['fi'|'sv'|'en']
	 * @return {Object} JSON presentation of localization key/value pairs   
     */
  getLocale: function(lang) {
     return this.__locale[lang];
  },
    /**
     * @method getLocale
     * Returns a single localized text matching the given key for current language
	 * @param {String} key
	 * 		localization key
	 * @return {String} localized text matching the key  
     */
  getText: function(key) {
     return this.loc[key];
}});