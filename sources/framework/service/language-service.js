/**
 * All the mapframework used by the texts in this file is defined in three
 * different languages (en,sv,fi).
 * 
 * Language service use UTF-8 encoding. Please use these characters: Ä -->
 * \u00C4 ä --> \u00E4 Ö --> \u00D6 ö --> \u00F6 Å --> \u00C5 å --> \u00E5
 * 
 * @param {Object}
 *            currentLanguage current user language, can be "fi", "sv" or "en"
 */
Oskari.clazz.define(
    'Oskari.mapframework.service.LanguageService',
    function(currentLanguage) {
        //this.currentLanguage = currentLanguage;
        this.currentLanguage = Oskari.getLang();
    }, {
        __qname: "Oskari.mapframework.service.LanguageService",
	getQName: function() {
	    return this.__qname;
	},

	__name : "LanguageService",
	getName : function() {
	    return this.__name;
	},

	/** Finnish language texts */
	languageProperties : {
	    "fi" : {
		/** Launcher */
		'launcher_failed_to_initialize_map_messagebox_title' : 'Kartan alustaminen ep\u00E4onnistui',
		'launcher_failed_to_initialize_map_messagebox_message' : 'Linkki, jolla yritit alustaa kartan on virheellinen. Tarkista, ett\u00E4 linkki on luotu karttaikkunan linkkity\u00F6kalulla ja ett\u00E4 linkin osoite on kopioitu kokonaisuudessaan selaimen osoitteeksi. Jos toistuvista yrityksist\u00E4 huolimatta linkki ei toimi, ole hyv\u00E4 ja ota yhteytt\u00E4 palvelun yll\u00E4pitoon.',

		/** Map application */
		'mapapplication_show_or_hide_menu_bar' : 'Piilota/N\u00E4yt\u00E4 valikko',
		'mapapplication_show_or_hide_table_bar' : 'Piilota/N\u00E4yt\u00E4 taulukko',
		'mapapplication_hide_menu_bar' : 'Piilota valikko',

		/** search */
		'search_cannot_be_empty' : 'Sy\u00F6t\u00E4 hakukentt\u00E4\u00E4n hakusana',
		'search_failure_messagebox_title' : 'Hakuvirhe',
		'search_failure_messagebox_message' : 'Haku ei nyt onnistunut. Kokeile hakua my\u00F6hemmin uudelleen.',

		/** search for published map */
		'search_published_map_no_results' : 'Haulla ei l\u00F6ytynyt tuloksia',
		'search_published_map_too_many_results' : 'L\u00F6ytyi yli 100 tulosta, tarkenna hakua.',

		/** Left panel languages */
		'leftpanel_maplevels_title' : 'KARTTATASOT',
		'leftpanel_organisation_title' : 'Organisaatio',
		'leftpanel_thema_title' : 'Teema',
		'leftpanel_own_maps_title' : 'Omat kartat',
		'leftpanel_selected_layers_title' : 'Valitut karttatasot',
		'leftpanel_new_window_title' : 'Uusi ikkuna',
		'leftpanel_empty_own_maps_content' : 'Ei omia karttoja',
		'leftpanel_find_maplayers_value' : 'Hae karttatasoja',
		'leftpanel_tree_menu_tooltip' : 'Valitse karttatasojen lajittelutapa',
		'leftpanel_filter_button_tooltip' : 'Palaa alkuper\u00E4iseen karttatasolistaukseen',
		'leftpanel_add_layer' : 'Lis\u00E4\u00E4 karttataso kartalle',
		'leftpanel_style' : 'Tyyli:',

		/** Right panel languages */
		'rightpanel_search_find_places_textbox_value' : 'Hae paikkoja/osoitteita',
		'rightpanel_search_find_places_button_value' : 'Hae',
		'rightpanel-searchresults-close_button_value' : 'Sulje hakutulokset',
		'rightpanel_wms_getfeatureinfo_button_value' : 'Sulje',
		'rightpanel_material_description_title' : 'Aineistokuvaus',
		'rightpanel_material_schema_title' : 'Tietotuotteen skeema',
		'rightpanel_material_legend_title' : 'Selite',
		'rightpanel_wms_getfeatureinfo_title' : 'Kohteen tiedot',
		'rightpanel_map_layer_have_not_description' : 'Kartan selitett\u00E4 ei l\u00F6ytynyt',
		'rightpanel_map_layer_have_not_schema' : 'Tietotuotteen skeemaa ei l\u00F6ydy.',
		'rightpanel_info_panel_close_button_title' : 'Sulje info',
		'rightpanel_wms_getfeatureinfo_not_supported_txt' : 'Ominaisuustietojen kysely ei ole tuettu valitsemallesi kartalle',

		/** Map service */
		'mapservice_basemap_show_info_title' : 'N\u00E4yt\u00E4 taustakartan tiedot',
		'mapservice_basemap_delete_title' : 'Poista taustakartta kartalta',
		'mapservice_layer_show_info_title' : 'N\u00E4yt\u00E4 karttatason tiedot',
		'mapservice_layer_delete_title' : 'Poista karttataso kartalta',
		'mapservice_layer_is_not_visible_in_this_scale_zoomin_map_title' : 'Karttataso ei ole k\u00E4ytett\u00E4viss\u00E4 t\u00E4ss\u00E4 mittakaavassa. L\u00E4henn\u00E4 (+) karttaa.',
		'mapservice_layer_is_not_visible_in_this_scale_zoomout_map_title' : 'Karttataso ei ole k\u00E4ytett\u00E4viss\u00E4 t\u00E4ss\u00E4 mittakaavassa. Loitonna (-) karttaa.',
		'mapservice_not_found_legend_image' : 'Ei l\u00F6ytynyt kartan selitteit\u00E4',
		'mapservice_change_layer_opacity_tooltip' : 'S\u00E4\u00E4d\u00E4 karttatason l\u00E4pin\u00E4kyvyytt\u00E4',
		'mapservice_basemap_image_tooltip' : 'Taustakartta',
		'mapservice_maplayer_image_tooltip' : 'Karttataso',
		'mapservice_published_error_params' : 'Virhe irrotetun kartan parametreissa, ole hyv\u00E4 ja ota yhteytt\u00E4 t\u00E4m\u00E4n sivuston yll\u00E4pit\u00E4j\u00E4\u00E4n.',
		'mapservice_select_layer_style' : 'Valitse tyyli',

		/** Map controls service */
//		'mapcontrolsservice_history_previous_tool_title' : 'Palaa navigointihistoriassa taaksep\u00E4in',
		'map_control_tool_prev_tooltip' : 'Palaa navigointihistoriassa taaksep\u00E4in',
//		'mapcontrolsservice_history_next_tool_title' : 'Siirry navigointihistoriassa eteenp\u00E4in',
		'map_control_tool_next_tooltip' : 'Siirry navigointihistoriassa eteenp\u00E4in',
//		'mapcontrolsservice_select_tool_title' : 'Raahaa karttaa pit\u00E4en hiiren vasenta painiketta pohjassa tai l\u00E4henn\u00E4 tuplaklikkaamalla',
		'map_control_navigate_tool_tooltip' : 'Raahaa karttaa pit\u00E4en hiiren vasenta painiketta pohjassa tai l\u00E4henn\u00E4 tuplaklikkaamalla',
//		'mapcontrolsservice_zoombox_in_tool_title' : 'L\u00E4henn\u00E4 haluamallesi alueelle rajaamalla alue pit\u00E4en hiiren vasenta painiketta pohjassa',
		'map_control_zoom_tool_tooltip' : 'L\u00E4henn\u00E4 haluamallesi alueelle rajaamalla alue pit\u00E4en hiiren vasenta painiketta pohjassa',
//		'mapcontrolsservice_measure_group_title' : 'Valitse mittausty\u00F6kalu',
		'map_control_measure_menu_tooltip' : 'Valitse mittausty\u00F6kalu',
//		'mapcontrolsservice_measure_tool_title' : 'Mittaa et\u00E4isyytt\u00E4',
		'map_control_measure_tool_tooltip' : 'Mittaa et\u00E4isyytt\u00E4',
//		'mapcontrolsservice_measure_area_tool_title' : 'Mittaa pinta-alaa',
		'map_control_measure_area_tool_tooltip' : 'Mittaa pinta-alaa',
		'mapcontrolsservice_info_group_title' : 'Valitse ty\u00F6kalu tietojen n\u00E4ytt\u00E4miseksi',
		'mapcontrolsservice_show_info_tool_title' : 'N\u00E4yt\u00E4 kohteen tiedot',
		'mapcontrolsservice_show_coordinates_tool_title' : 'N\u00E4yt\u00E4 koordinaatit',
		'mapcontrolsservice_add_group_title' : 'Valitse merkint\u00E4ty\u00F6kalu',
		'mapcontrolsservice_add_point_tool_title' : 'Lis\u00E4\u00E4 piste',
		'mapcontrolsservice_add_line_tool_title' : 'Lis\u00E4\u00E4 reitti',
		'mapcontrolsservice_add_area_tool_title' : 'Lis\u00E4\u00E4 alue',
//		'mapcontrolsservice_generate_link_tool_title' : 'Luo linkki kartalle',
		'map_control_map_link_tool_tooltip' : 'Luo linkki kartalle',
		'mapcontrolsservice_save_and_print_group_title' : 'Valitse Tallenna- tai Tulosta-ty\u00F6kalu',
		'mapcontrolsservice_save_tool_title' : 'Tallenna',
//		'mapcontrolsservice_print_tool_title' : 'Tulosta',
		'map_control_print_tool_tooltip' : 'Tulosta',
		'mapcontrolsservice_mappublisher_tool_title' : 'Siirry kartan julkaisuun',
		'mapcontrolsservice_zoomlevel_street_title' : 'Katu',
		'mapcontrolsservice_zoomlevel_part_of_a_town_title' : 'Kunnan osa',
		'mapcontrolsservice_zoomlevel_town_title' : 'Kunta',
		'mapcontrolsservice_zoomlevel_province_title' : 'Maakunta',
		'mapcontrolsservice_zoomlevel_country_title' : 'Koko maa',
//		'mapcontrolsservice_fullscreen_tool_title' : 'Suurenna/pienenn\u00E4 kartta koko n\u00E4yt\u00F6lle',
		'map_control_full_screen_tool_tooltip' : 'Suurenna/pienenn\u00E4 kartta koko n\u00E4yt\u00F6lle',
		'mapcontrolsservice_measure_length_title' : 'Et\u00E4isyys',
		'mapcontrolsservice_measure_area_title' : 'Pinta-ala',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_title' : 'Karttatasoa ei ole valittu',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_message' : 'Valitse haluamasi karttataso "Valitut karttatasot" -valikosta klikkaamalla karttatason nime\u00E4.',
		'mapcontrolsservice_not_found_wms_feature_info' : 'Kohteelle ei l\u00F6ytynyt tietoa',
		'mapcontrolsservice_maplink_tool_title' : 'Tee linkki n\u00E4kyviss\u00E4 olevaan karttaan',
		'mapcontrolsservice_getting_WMS_info_title' : 'Haetaan kohteen tietoja...',
		'mapcontrolsservice_indexmap_title' : 'N\u00E4yt\u00E4/piilota l\u00E4hestymiskartta',
		'mapcontrolsservice_start_network_service_tool_title' : 'Avaa yll\u00E4pitopalvelu',
		'mapcontrolsservice_problem_with_safari_printing_title' : 'Tulostus ei onnistu',
		'mapcontrolsservice_problem_with_safari_printing_message' : 'Paikkatietoikkuna ei tue l\u00E4pin\u00E4kyvien karttojen tulostamista Safari-selaimella. L\u00E4pin\u00E4kyvien karttojen tulostus on tuettu Internet Explorer-, Firefox-, Opera-, ja Chrome-selaimilla. Voit s\u00E4\u00E4t\u00E4\u00E4 kaikkien karttojen l\u00E4pin\u00E4kyvyyden arvoon 100% ja tulostaa uudelleen tai vaihtoehtoisesti luoda linkin nykyiseen n\u00E4kym\u00E4\u00E4n ja avata sen tulostusl\u00E4pin\u00E4kyvyytt\u00E4 tukevalla selaimella.',

		/** Search service */
		'searchservice_search_cannot_be_empty' : 'Sy\u00F6t\u00E4 hakukentt\u00E4\u00E4n hakusana.',
		'searchservice_search_alert_title' : 'Haku',
		'searchservice_search_not_found_anything_text' : 'Antamallasi hakusanalla ei l\u00F6ytynyt tuloksia. Tarkista, ett\u00E4 kirjoitit hakusanan varmasti oikein.',
		'searchservice_search_result_column_name' : 'Nimi',
		'searchservice_search_result_column_village' : 'Kunta',
		'searchservice_search_result_column_type' : 'Tyyppi',
		'searchservice_searching_title' : 'Etsit\u00E4\u00E4n...',

		/** MapLink service */
		'maplinkservice_link_generated_messagebox_title' : 'Suora karttalinkki',
		'maplinkservice_link_generated_messagebox_message' : 'T\u00E4ll\u00E4 linkill\u00E4 p\u00E4\u00E4set palaamaan suoraan luomaasi n\u00E4kym\u00E4\u00E4n. Linkkiin on tallennettu sijainti, mittakaava, valitut karttatasot, niiden l\u00E4pin\u00E4kyvyysasetukset sek\u00E4 valitut tyylit.<br/><br/><textarea id="mapLinkTextarea" rows="2" cols="100">##0##</textarea>',
		'maplinkservice_link_generation_failed_messagebox_title' : 'Linkin muodostaminen ep\u00E4onnistui',
		'maplinkservice_link_generation_failed_messagebox_message' : 'Linkin muodostamisessa tapahtui virhe. Kokeile sen muodostamista uudelleen hetken kuluttua. Jos ongelma ei korjaannu, ole hyv\u00E4 ja ota yhteytt\u00E4 yll\u00E4pitoon.',

		/** Published map */
		'published_map_search_textbox_value' : 'Hae paikkoja/osoitteita',
		'published_map_search_button_value' : 'Hae',
		'published_map_is_empty' : '<p>Julkaisemassasi kartassa ei ole viel\u00E4 valittuna yht\u00E4\u00E4n taustakarttaa tai karttaa.</p><p>Aloita valitsemalla vasemmalta kartta.</p>',
		'published_map_exceeded_limit' : 'Sallittu palvelupyyntöjen m\u00E4\u00E4r\u00E4 on ylittynyt. Voit kuitenkin avata',
		'published_map_exceeded_limit_link_text' : 'kartan Paikkatietoikkunassa',
		'published_map_terms_of_use' : 'K\u00E4ytt\u00F6ehdot',

		/** Map move and draw module */
		'map_move_and_draw_module_select_searc_area_title' : 'Rajaa hakualue',

		/** Wizard modules */
		'wizard_module_confirm_close_button_value' : 'Sulje',
		'wizard_module_confirm_cancel_button_value' : 'Peruuta',
		'wizard_service_module_confirm_message_title' : 'Suljetaanko m\u00E4\u00E4rittely?',
		'wizard_service_module_confirm_message' : '<br>Olet sulkemassa m\u00E4\u00E4rittely\u00E4 tallentamatta tekemi\u00E4si muutoksia.<br>Haluatko sulkea m\u00E4\u00E4rittelyn?<br><br>',
		'wizard_module_previous_button_value' : 'Edellinen',
		'wizard_module_next_button_value' : 'Seuraava',
    		'wizard_module_progressbar_start_value' : 'Vaiheen',
		'wizard_module_progressbar_end_value' : 'm\u00E4\u00E4ritys',
		'wizard_module_save_button_value' : 'Tallenna',

		/** Statusbar texts */
		'status_wfs_update_grid' : 'P\u00E4ivitet\u00E4\u00E4n taulukkoa...',
		'status_update_map' : 'P\u00E4ivitet\u00E4\u00E4n karttaa',
		'status_search' : 'Suoritetaan hakua...',
		'status_get_feature_info' : 'Haetaan ominaisuustietoja...',
		'status_multiple_tasks_running' : 'teht\u00E4v\u00E4\u00E4 jonossa',
		'status_tooltip_header' : 'Tila',

		/** Search module */
		'search_module_popup_layer_is_wfs_title' : 'Valittu karttataso on tietotuote',

		/** Selected layers module */
		'selected_layers_module_highlight_wms_layer' : 'Aktivoi kohdetietojen n\u00E4ytt\u00F6',
		'selected_layers_module_highlight_wfs_layer' : 'Avaa kohdetietotaulukko',
		'selected_layers_module_dim_wms_layer' : 'Lopeta kohdetietojen n\u00E4ytt\u00F6',
		'selected_layers_module_dim_wfs_layer' : 'Sulje kohdetietotaulukko',
		'selected_layers_module_wfs_icon_tooltip' : 'Tietotuote',
		'selected_layers_module_collapse_panel_tooltip' : 'Piilota l\u00E4pin\u00E4kyvyyden ja tyylin s\u00E4\u00E4t\u00F6',
		'selected_layers_module_expand_panel_tooltip' : 'N\u00E4yt\u00E4 l\u00E4pin\u00E4kyvyyden ja tyylin s\u00E4\u00E4t\u00F6',

		/** Grid module */
		'grid_module_not_found_info_for_selected_area' : 'Kartan alueelta ei l\u00F6ydy tietoja.',
		'grid_module_loading_info' : 'Ladataan...',
		'grid_module_wfs_maplayer_not_visible_this_scale' : 'Tietotuote ei ole k\u00E4ytett\u00E4viss\u00E4 t\u00E4ss\u00E4 mittakaavassa. L\u00E4henn\u00E4 (+) tai loitonna (-) karttaa.',
		'grid_module_gridpanel_title' : '{0} -tietotuotteen kohdetyypit',
		'grid_module_gridpanel_no_title' : 'Ei tietotuotetta',
		'grid_module_feature_type_title' : 'Kohdetyyppi',
		'grid_module_all_tab_title' : 'Kaikki',
		'grid_module_featuretype_tab_tooltip' : 'Kohdetyypin tiedot',
		'grid_module_all_tab_tooltip' : 'Kaikkien tietotuotteen kohdetyyppien tiedot',
		'grid_module_column_header_tooltip' : 'Lajittele ominaisuustiedon arvon perusteella',

		/** OverlayPopupModule */
		'overlay_popup_module_close_button_text' : 'Sulje',

		/** Selected layers module */
		'selected_layers_module_published_basemaps_title' : 'Julkaistavat taustakartat',// check
		'selected_layers_module_published_maps_title' : 'Julkaistavat kartat' // check
		

	    },

	    /**
	     * English language texts, this language is not
	     * supported yet
	     */
	    "en" : {
		/** Launcher */
		'launcher_failed_to_initialize_map_messagebox_title' : 'Initialization of the map failed',
		'launcher_failed_to_initialize_map_messagebox_message' : 'The link used for initializing the map is incorrect. Make sure that the link is created using the map window\'s link tool and that the whole link address is copied as the browser address. If the link cannot be opened despite of several.',
		/** Map application */
		'mapapplication_show_or_hide_menu_bar' : 'Show/hide menu',
		'mapapplication_show_or_hide_table_bar' : 'Hide/Show table',
		'mapapplication_hide_menu_bar' : 'Hide menu',
		/** search */
		'search_cannot_be_empty' : 'Search cannot be empty.',
		'search_failure_messagebox_title' : 'Search error',
		'search_failure_messagebox_message' : 'Unable to search at this time. Please try again later.',
		/** search for published map */
		'search_published_map_no_results' : 'No results found',
		'search_published_map_too_many_results' : 'Over 100 results found. Please define your search.',
		/** Left panel languages */
		'leftpanel_maplevels_title' : 'MAP LAYERS',
		'leftpanel_organisation_title' : 'Organisation',
		'leftpanel_thema_title' : 'Theme',
		'leftpanel_own_maps_title' : 'My maps',
		'leftpanel_selected_layers_title' : 'Selected map layers',
		'leftpanel_new_window_title' : 'New window',
		'leftpanel_empty_own_maps_content' : 'My maps is empty',
		'leftpanel_find_maplayers_value' : 'Find map layers',
		'leftpanel_tree_menu_tooltip' : 'Sort map layers by',
		'leftpanel_filter_button_tooltip' : 'Return to default map layer listing',
		'leftpanel_add_layer' : 'Add maplayer',
		'leftpanel_style' : 'Style:',
		/** Right panel languages */
		'rightpanel_search_find_places_textbox_value' : 'Find places',
		'rightpanel_search_find_places_button_value' : 'Find',
		'rightpanel-searchresults-close_button_value' : 'Close search results',
		'rightpanel_wms_getfeatureinfo_button_value' : 'Close',
		'rightpanel_material_description_title' : 'Map layer description',
		'rightpanel_material_schema_title' : 'Data product schema',
		'rightpanel_material_legend_title' : 'Legend',
		'rightpanel_wms_getfeatureinfo_title' : 'Feature information',
		'rightpanel_map_layer_have_not_description' : 'Map legend not found.',
		'rightpanel_map_layer_have_not_schema' : 'Data product schema is not available.',
		'rightpanel_info_panel_close_button_title' : 'Close info',
		'rightpanel_wms_getfeatureinfo_not_supported_txt' : 'Enquiry of feature information is not supported on selected map layer ',
		/** Map service */
		'mapservice_basemap_show_info_title' : 'Show background map info',
		'mapservice_basemap_delete_title' : 'Delete background map',
		'mapservice_layer_show_info_title' : 'Show map layer info',
		'mapservice_layer_delete_title' : 'Delete map layer',
		'mapservice_layer_is_not_visible_in_this_scale_zoomin_map_title' : 'Map layer is not visible in current map scale. Zoom in (+) the map.',
		'mapservice_layer_is_not_visible_in_this_scale_zoomout_map_title' : 'Map layer is not visible in current map scale. Zoom out (-) the map.',
		'mapservice_not_found_legend_image' : 'Map legends not found',
		'mapservice_change_layer_opacity_tooltip' : 'Adjust transparency of map layer',
		'mapservice_basemap_image_tooltip' : 'Background map',
		'mapservice_maplayer_image_tooltip' : 'Map layer',
		'mapservice_published_error_params' : 'Error in the parametres of the published map. Please contact the website support.',
		'mapservice_select_layer_style' : 'Choose style',
		/** Map controls service */
		'map_control_tool_prev_tooltip' : 'Go to previous view',
		'map_control_tool_next_tooltip' : 'Go to next view in on navigation history',
		'map_control_navigate_tool_tooltip' : 'Navigate',
		'map_control_zoom_tool_tooltip' : 'Zoom In',
		'map_control_measure_menu_tooltip' : 'Select measure tool',
		'map_control_measure_tool_tooltip' : 'Measure length',
		'map_control_measure_area_tool_tooltip' : 'Measure area',
		'mapcontrolsservice_info_group_title' : 'Select info tool',
		'mapcontrolsservice_show_info_tool_title' : 'Show info',
		'mapcontrolsservice_show_coordinates_tool_title' : 'Show coordinates',
		'mapcontrolsservice_add_group_title' : 'Select add tool',
		'mapcontrolsservice_add_point_tool_title' : 'Add point',
		'mapcontrolsservice_add_line_tool_title' : 'Add route',
		'mapcontrolsservice_add_area_tool_title' : 'Add area',
		'map_control_map_link_tool_tooltip' : 'Establish a link to the map',
		'mapcontrolsservice_save_and_print_group_title' : 'Select save or print tool',
		'mapcontrolsservice_save_tool_title' : 'Save',
		'map_control_print_tool_tooltip' : 'Print',
		'mapcontrolsservice_mappublisher_tool_title' : 'Start map publisher',
		'mapcontrolsservice_zoomlevel_street_title' : 'Street',
		'mapcontrolsservice_zoomlevel_part_of_a_town_title' : 'Part of town',
		'mapcontrolsservice_zoomlevel_town_title' : 'Town',
		'mapcontrolsservice_zoomlevel_province_title' : 'Province',
		'mapcontrolsservice_zoomlevel_country_title' : 'Country',
		'map_control_full_screen_tool_tooltip' : 'Maximize/minimize map',
		'mapcontrolsservice_measure_length_title' : 'Distance',
		'mapcontrolsservice_measure_area_title' : 'Area',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_title' : 'No map layer selected',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_message' : 'Choose one map layer among those added to the map by clicking it.',
		'mapcontrolsservice_not_found_wms_feature_info' : 'No info found',
		'mapcontrolsservice_maplink_tool_title' : 'Establish a link to the visible map',
		'mapcontrolsservice_getting_WMS_info_title' : 'Searching feature information...',
		'mapcontrolsservice_indexmap_title' : 'Show/hide index map',
		'mapcontrolsservice_start_network_service_tool_title' : 'Open maintenance service',
		'mapcontrolsservice_problem_with_safari_printing_title' : 'Problem with printing',
		'mapcontrolsservice_problem_with_safari_printing_message' : 'Paikkatietoikkuna doesn\'t support the printing of transparent maps on web browser Safari. Printing transparent maps is supported on the following browsers: Internet Explorer, Firefox, Opera and Chrome. You can adjust the transparency value in all maps up to 100% and reprint or alternatively create a new link in the current view and open the link with a browser that enables the printing of transparent maps.',
		/** Search service */
		'searchservice_search_cannot_be_empty' : 'Search cannot be empty.',
		'searchservice_search_alert_title' : 'Search',
		'searchservice_search_not_found_anything_text' : 'Your search did not provide any results. Please check your spelling.',
		'searchservice_search_result_column_name' : 'Name',
		'searchservice_search_result_column_village' : 'Municipality',
		'searchservice_search_result_column_type' : 'Type',
		'searchservice_searching_title' : 'Searching...',
		/** MapLink service */
		'maplinkservice_link_generated_messagebox_title' : 'Direct map link',
		'maplinkservice_link_generated_messagebox_message' : 'Use this link to return directly to the view created. Location, scale, selected map layers, their transparency settings and selected styles are stored in the link.<br/><br/><textarea id="mapLinkTextarea" rows="2" cols="100">##0##</textarea>',
		'maplinkservice_link_generation_failed_messagebox_title' : 'The link could not be established',
		'maplinkservice_link_generation_failed_messagebox_message' : 'An error occurred when establishing the link. Try again. If the problem cannot be solved, please contact the service support.',
		/** Published map */
		'published_map_search_textbox_value' : 'Find places',
		'published_map_search_button_value' : 'Find',
		'published_map_is_empty' : '<p>No maps or background maps are selected for the published map.</p><p>Start by selecting a map on the left.</p>',
		'published_map_exceeded_limit' : 'You have exceeded the allowed amount of service requests. It is still possible to open',
		'published_map_exceeded_limit_link_text' : 'the map at Paikkatietoikkuna',
		'published_map_terms_of_use' : 'Terms of Use',
		/** Map move and draw module */
		'map_move_and_draw_module_select_searc_area_title' : 'Define search area',
		/** Wizard modules */
		'wizard_module_confirm_close_button_value' : 'Close',
		'wizard_module_confirm_cancel_button_value' : 'Cancel',
		'wizard_service_module_confirm_message_title' : 'Close the definition?',
		'wizard_service_module_confirm_message' : '<br>You are about to close the definition without saving your changes.<br>Do you want to close the definition?<br><br>',
		'wizard_module_previous_button_value' : 'Previous',
		'wizard_module_next_button_value' : 'Next',
		'wizard_module_progressbar_start_value' : 'Phase',
		'wizard_module_progressbar_end_value' : 'definition',
		'wizard_module_save_button_value' : 'Save',
		/** Statusbar texts */
		'status_wfs_update_grid' : 'Updating table...',
		'status_update_map' : 'Updating map',
		'status_search' : 'Searching...',
		'status_get_feature_info' : 'Searching feature attributes...',
		'status_multiple_tasks_running' : 'tasks in queue',
		'status_tooltip_header' : 'Mode',
		/** Search module */
		'search_module_popup_layer_is_wfs_title' : 'Selected map layer is data product',
		/** Selected layers module */
		'selected_layers_module_highlight_wms_layer' : 'Activate to view feature information',
		'selected_layers_module_highlight_wfs_layer' : 'Open attribute table',
		'selected_layers_module_dim_wms_layer' : 'Stop viewing feature information',
		'selected_layers_module_dim_wfs_layer' : 'Close feature attribute table',
		'selected_layers_module_wfs_icon_tooltip' : 'Data product',
		'selected_layers_module_collapse_panel_tooltip' : 'Hide transparency and style adjustment',
		'selected_layers_module_expand_panel_tooltip' : 'Show transparency and style adjustment',
		/** Grid module */
		'grid_module_not_found_info_for_selected_area' : 'No information found on the map area.',
		'grid_module_loading_info' : 'Loading...',
		'grid_module_wfs_maplayer_not_visible_this_scale' : 'Data product is not available in this scale. Zoom in (+) or zoom out (-) the map.',
		'grid_module_gridpanel_title' : 'Feature types for data product {0}',
		'grid_module_gridpanel_no_title' : 'No data product',
		'grid_module_feature_type_title' : 'Feature type',
		'grid_module_all_tab_title' : 'All',
		'grid_module_featuretype_tab_tooltip' : 'Feature type information',
		'grid_module_all_tab_tooltip' : 'Information about all feature types of data product',
		'grid_module_column_header_tooltip' : 'Sort according to attribute value',
		/** OverlayPopupModule */
		'overlay_popup_module_close_button_text' : 'Close',
		/** Selected layers module */
		'selected_layers_module_published_basemaps_title' : 'Julkaistavat taustakartat',// check
		'selected_layers_module_published_maps_title' : 'Julkaistavat kartat'// check
	    },

	    /** Swedish language texts */
	    "sv" : {
		/** Launcher */
		'launcher_failed_to_initialize_map_messagebox_title' : 'Initieringen av kartan misslyckades',
		'launcher_failed_to_initialize_map_messagebox_message' : 'L\u00E4nken du anv\u00E4nde f\u00F6r att initiera kartan \u00E4r felaktig. Kontrollera att l\u00E4nken har bildats med l\u00E4nkverktyget i kartf\u00F6nstret och att l\u00E4nkens adress \u00E4r kopierad i sin helhet som',
		/** Map application */
		'mapapplication_show_or_hide_menu_bar' : 'D\u00F6lj/Visa menyn',
		'mapapplication_show_or_hide_table_bar' : 'D\u00F6lj/Visa tabellen',
		'mapapplication_hide_menu_bar' : 'D\u00F6lj menyn',
		/** search */
		'search_cannot_be_empty' : 'Mata in s\u00F6kordet i s\u00F6kf\u00E4ltet',
		'search_failure_messagebox_title' : 'S\u00F6kfel',
		'search_failure_messagebox_message' : 'S\u00F6kningen lyckas inte f\u00F6r tillf\u00E4llet. F\u00F6rs\u00F6k igen senare.',
		/** search for published map */
		'search_published_map_no_results' : 'Inga tr\u00E4ff',
		'search_published_map_too_many_results' : '\u00F6ver 100 tr\u00E4ffar, avgr\u00E4nsa s\u00F6kningen.',
		/** Left panel languages */
		'leftpanel_maplevels_title' : 'KARTLAGER',
		'leftpanel_organisation_title' : 'Organisation',
		'leftpanel_thema_title' : 'Tema',
		'leftpanel_own_maps_title' : 'Mina kartor',
		'leftpanel_selected_layers_title' : 'Valda kartlager',
		'leftpanel_new_window_title' : 'Nytt f\u00F6nster',
		'leftpanel_empty_own_maps_content' : 'Inga egna kartor',
		'leftpanel_find_maplayers_value' : 'S\u00F6k kartlager',
		'leftpanel_tree_menu_tooltip' : 'V\u00E4lj sorteringss\u00E4tt f\u00F6r kartlagren.',
		'leftpanel_filter_button_tooltip' : 'Tillbaka till den f\u00F6rvalda f\u00F6rteckningen \u00F6ver kartlager.',
		'leftpanel_add_layer' : 'Tills\u00E4tt kartlager',
		'leftpanel_style' : 'Stil:',
		/** Right panel languages */
		'rightpanel_search_find_places_textbox_value' : 'S\u00F6k plats/adress',
		'rightpanel_search_find_places_button_value' : 'S\u00F6k',
		'rightpanel-searchresults-close_button_value' : 'St\u00E4ng s\u00F6kresultat',
		'rightpanel_wms_getfeatureinfo_button_value' : 'St\u00E4ng',
		'rightpanel_material_description_title' : 'Materialbeskrivning',
		'rightpanel_material_schema_title' : 'Dataproduktens schema',
		'rightpanel_material_legend_title' : 'F\u00F6rklaringen',
		'rightpanel_wms_getfeatureinfo_title' : 'Egenskapsuppgifter',
		'rightpanel_map_layer_have_not_description' : 'F\u00F6rklaringen f\u00F6r kartan hittas inte.',
		'rightpanel_map_layer_have_not_schema' : 'Dataproduktens schemauppgifter hittas inte.',
		'rightpanel_info_panel_close_button_title' : 'St\u00E4ng info',
		'rightpanel_wms_getfeatureinfo_not_supported_txt' : 'F\u00F6rfr\u00E5gan om egenskapsuppgifter st\u00F6ds inte f\u00F6r den valda kartan',
		/** Map service */
		'mapservice_basemap_show_info_title' : 'Visa information om bakgrundskartan',
		'mapservice_basemap_delete_title' : 'Radera bakgrundskartan',
		'mapservice_layer_show_info_title' : 'Visa information om kartlager',
		'mapservice_layer_delete_title' : 'Radera kartlager',
		'mapservice_layer_is_not_visible_in_this_scale_zoomin_map_title' : 'Kartlagret kan inte visas i denna skala. Zooma in (+) kartan.',
		'mapservice_layer_is_not_visible_in_this_scale_zoomout_map_title' : 'Kartlagret kan inte visas i denna skala. Zooma ut (-) kartan.',
		'mapservice_not_found_legend_image' : 'F\u00F6rklaringar f\u00F6r kartan hittas inte',
		'mapservice_change_layer_opacity_tooltip' : 'Justera kartlagrets genomsynlighet',
		'mapservice_basemap_image_tooltip' : 'Bakgrundskarta',
		'mapservice_maplayer_image_tooltip' : 'Kartlager',
		'mapservice_published_error_params' : 'Fel i den avskiljda kartans parametrar, var god och kontakta denna webbplats underh\u00E5ll.',
		'mapservice_select_layer_style' : 'V\u00E4lj stil',
		/** Map controls service */
		'map_control_tool_prev_tooltip' : 'G\u00E5 tillbaka i navigeringshistorien',
		'map_control_tool_next_tooltip' : 'G\u00E5 fram\u00E5t i navigeringshistorien',
		'map_control_navigate_tool_tooltip' : 'Navigera eller v\u00E4lj',
		'map_control_zoom_tool_tooltip' : 'Zooma in p\u00E5 det \u00F6nskade omr\u00E5det genom att gr\u00E4nsa omr\u00E5det med att h\u00E5lla musens v\u00E4nstra knapp nedtryckt',
		'map_control_measure_menu_tooltip' : 'V\u00E4lj m\u00E4tverktyg',
		'map_control_measure_tool_tooltip' : 'M\u00E4t avst\u00E5nd',
		'map_control_measure_area_tool_tooltip' : 'M\u00E4t areal',
		'mapcontrolsservice_info_group_title' : 'V\u00E4lj verktyg f\u00F6r att visa uppgifter',
		'mapcontrolsservice_show_info_tool_title' : 'Visa objektets uppgifter',
		'map_control_map_link_tool_tooltip' : 'Bilda l\u00E4nk p\u00E5 kartan',
		'mapcontrolsservice_show_coordinates_tool_title' : 'Visa koordinaterna',
		'mapcontrolsservice_add_group_title' : 'V\u00E4lj anteckningsverktyg',
		'mapcontrolsservice_add_point_tool_title' : 'Tills\u00E4tt punkt',
		'mapcontrolsservice_add_line_tool_title' : 'Tills\u00E4tt rutt',
		'mapcontrolsservice_add_area_tool_title' : 'Tills\u00E4tt omr\u00E5de',
		'mapcontrolsservice_save_and_print_group_title' : 'V\u00E4lj verktyget Spara eller Skriv ut',
		'mapcontrolsservice_save_tool_title' : 'Spara',
		'map_control_print_tool_tooltip' : 'Skriv ut',
		'mapcontrolsservice_mappublisher_tool_title' : 'Till publicering av kartan',
		'mapcontrolsservice_zoomlevel_street_title' : 'Gata',
		'mapcontrolsservice_zoomlevel_part_of_a_town_title' : 'Stadsdel',
		'mapcontrolsservice_zoomlevel_town_title' : 'Kommun',
		'mapcontrolsservice_zoomlevel_province_title' : 'Landskap',
		'mapcontrolsservice_zoomlevel_country_title' : 'Hela landet',
		'map_control_full_screen_tool_tooltip' : 'F\u00F6rstora/f\u00F6rminska kartan p\u00E5 hela bildsk\u00E4rmen',
		'mapcontrolsservice_measure_length_title' : 'Avst\u00E5nd',
		'mapcontrolsservice_measure_area_title' : 'Areal',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_title' : 'Du har inte valt kartlager',
		'mapcontrolsservice_layer_info_layer_not_selected_messagebox_message' : 'V\u00E4lj ett av kartlagren som tillagts p\u00E5 kartan genom att klicka det.',
		'mapcontrolsservice_not_found_wms_feature_info' : 'Info hittas inte',
		'mapcontrolsservice_maplink_tool_title' : 'Skapa l\u00E4nk till synliga kartan',
		'mapcontrolsservice_getting_WMS_info_title' : 'S\u00F6ker egenskapsuppgifter...',
		'mapcontrolsservice_indexmap_title' : 'Visa/d\u00F6lj positioneringskarta',
		'mapcontrolsservice_start_network_service_tool_title' : '\u00D6ppna underh\u00E5llstj\u00E4nst',
		'mapcontrolsservice_problem_with_safari_printing_title' : 'Problem med utskrivningen',
		'mapcontrolsservice_problem_with_safari_printing_message' : 'Paikkatietoikkuna st\u00F6der inte utskrivningen av genomskinliga kartor p\u00E5 webbl\u00E4saren Safari. Utskrivningen av genomskinliga kartor st\u00F6ds p\u00E5 webbl\u00E4sarna Internet Explorer, Firefox, Opera och Chrome. Du kan justera alla kartornas genomskinlighetsv\u00E4rde upp till 100 % och skriva ut p\u00E5 nytt eller alternativt skapa en ny l\u00E4nk i den nuvarande vyn och \u00F6ppna l\u00E4nken med en webbl\u00E4sare som m\u00F6jligg\u00F6r utskrivningen av genomskinliga kartor.',
		/** Search service */
		'searchservice_search_cannot_be_empty' : 'Mata in s\u00F6kordet i s\u00F6kf\u00E4ltet.',
		'searchservice_search_alert_title' : 'S\u00F6k',
		'searchservice_search_not_found_anything_text' : 'Ditt s\u00F6kord gav inga resultat. Kontrollera att du s\u00E4kert skrev s\u00F6kordet p\u00E5 r\u00E4tt s\u00E4tt.',
		'searchservice_search_result_column_name' : 'Namn',
		'searchservice_search_result_column_village' : 'Kommun',
		'searchservice_search_result_column_type' : 'Typ',
		'searchservice_searching_title' : 'S\u00F6ker...',
		/** MapLink service */
		'maplinkservice_link_generated_messagebox_title' : 'Direkt kartl\u00E4nk',
		'maplinkservice_link_generated_messagebox_message' : 'Med l\u00E4nken kommer du direkt tillbaka till den vy du skapat. L\u00E4nken omfattar l\u00E4get, skalan, valda kartlager, deras inst\u00E4llningar f\u00F6r genomsynlighet samt valda stilar.<br/><br/><textarea id="mapLinkTextarea" rows="2" cols="100">##0##</textarea>',
		'maplinkservice_link_generation_failed_messagebox_title' : 'L\u00E4nkskapandet misslyckades',
		'maplinkservice_link_generation_failed_messagebox_message' : 'Ett fel intr\u00E4ffade i samband med l\u00E4nkskapandet. F\u00F6rs\u00F6k skapa l\u00E4nken p\u00E5 nytt om en stund. Om problemet upprepas, var god och kontakta underh\u00E5llet.',
		/** Published map */
		'published_map_search_textbox_value' : 'S\u00F6k plats/adress',
		'published_map_search_button_value' : 'S\u00F6k',
		'published_map_is_empty' : '<p>Du har inte valt karta eller bakgrundskarta f\u00F6r kartan som du publicerat.</p><p>B\u00F6rja med att v\u00E4lja en karta till v\u00E4nster.</p>',
		'published_map_exceeded_limit' : 'Det till\u00E5tna antalet framst\u00E4llningar har \u00F6verskridits. Du kan \u00E4nd\u00E5 \u00F6ppna',
		'published_map_exceeded_limit_link_text' : 'kartan p\u00E5 Paikkatietoikkuna',
		'published_map_terms_of_use' : 'Anv\u00E4ndningsvillkor',
		/** Map move and draw module */
		'map_move_and_draw_module_select_searc_area_title' : 'Begr\u00E4nsa s\u00F6komr\u00E5det',
		/** Wizard modules */
		'wizard_module_confirm_close_button_value' : 'St\u00E4ng',
		'wizard_module_confirm_cancel_button_value' : 'Annullera',
		'wizard_service_module_confirm_message_title' : 'St\u00E4ng definitionen?',
		'wizard_service_module_confirm_message' : '<br>Du h\u00E5ller p\u00E5 att st\u00E4nga definitionen utan att spara dina \u00E4ndringar.<br>Vill du st\u00E4nga definitionen?<br><br>',
		'wizard_module_previous_button_value' : 'F\u00F6reg\u00E5ende',
		'wizard_module_next_button_value' : 'N\u00E4sta',
		'wizard_module_progressbar_start_value' : 'Fas',
		'wizard_module_progressbar_end_value' : 'definition',
		'wizard_module_save_button_value' : 'Spara',
		/** Statusbar texts */
		'status_wfs_update_grid' : 'Uppdaterar tabellen...',
		'status_update_map' : 'Uppdaterar kartan',
		'status_search' : 'S\u00F6ker...',
		'status_get_feature_info' : 'S\u00F6ker egenskapsuppgifter...',
		'status_multiple_tasks_running' : 'uppdrag i k\u00F6',
		'status_tooltip_header' : 'L\u00E4ge',
		/** Search module */
		'search_module_popup_layer_is_wfs_title' : 'Valda kartlagret \u00E4r dataprodukt',
		/** Selected layers module */
		'selected_layers_module_highlight_wms_layer' : 'Aktivera f\u00F6r att l\u00E4sa objektuppgifter',
		'selected_layers_module_highlight_wfs_layer' : '\u00D6ppna objektuppgiftstabellen',
		'selected_layers_module_dim_wms_layer' : 'Avbryt att visa objektuppgifter',
		'selected_layers_module_dim_wfs_layer' : 'St\u00E4ng objektuppgiftstabellen',
		'selected_layers_module_wfs_icon_tooltip' : 'Dataprodukt',
		'selected_layers_module_collapse_panel_tooltip' : 'D\u00F6lj justering av stil och genomsynlighet',
		'selected_layers_module_expand_panel_tooltip' : 'Vis justering av stil och genomsynlighet',
		/** Grid module */
		'grid_module_not_found_info_for_selected_area' : 'Information p\u00E5 kartomr\u00E5det hittas inte.',
		'grid_module_loading_info' : 'Laddar...',
		'grid_module_wfs_maplayer_not_visible_this_scale' : 'Dataprodukten \u00E4r inte tillg\u00E4nglig i denna skala. Zooma in (+) eller zooma ut (-) kartan.',
		'grid_module_gridpanel_title' : 'Objekttyperna f\u00F6r dataprodukten {0}',
		'grid_module_gridpanel_no_title' : 'Ingen dataprodukt',
		'grid_module_feature_type_title' : 'Objekttyp',
		'grid_module_all_tab_title' : 'Alla',
		'grid_module_featuretype_tab_tooltip' : 'Uppgifter om objekttyp',
		'grid_module_all_tab_tooltip' : 'Uppgifter om dataproduktens alla objekttyper',
		'grid_module_column_header_tooltip' : 'Sortera enligt v\u00E4rdet p\u00E5 egenskapsuppgift',
		/** OverlayPopupModule */
		'overlay_popup_module_close_button_text' : 'St\u00E4ng',
		/** Selected layers module */
		'selected_layers_module_published_basemaps_title' : 'Julkaistavat taustakartat',// check
		'selected_layers_module_published_maps_title' : 'Julkaistavat kartat'// check

	    }
	},
	
    get : function(key,params) {
        var currentLanguage = this.currentLanguage;
        var value = this.languageProperties[currentLanguage][key];

        if(value === null) {
            return "undefined key '" + key + "' for language '" + currentLanguage + "'";
        } else {
            if(params) {
                value = this.formatMessage(value, params);
            }
            return value;
        }
    },
	/**
	 * Formats given message with the given params array values
	 * Example:  formatMessage("Hello {0}!", ["World"]);
	 * @param msg message to be formatted
	 * @param params array of params that has values for {arrayIndex} in param msg
	 */
    formatMessage : function(msg, params) {
        var formatted = msg;
        for(var index in params) {
            formatted = formatted.replace("{" + index + "}", params[index]);
        }
        return formatted;
    },

	/**
	 * Shows popup message with given title key and message key.
	 * 
	 * @param title_key
	 *            key for title
	 * @param message_key
	 *            key for actual message
	 * 
	 * @param placeholders
	 *            placeholders enable you to replace parts of
	 *            message by replacing special strings inside
	 *            message. placeholders are marked inside
	 *            message using ##number## notation and these
	 *            replacements should be given in an array for
	 *            this method. For example givin calling
	 *            showPopup('key', 'message', ['this is
	 *            replacement 1', 'this is replacement 2']);
	 *            method will replace ##0## with 'this is
	 *            replacement 1' and ##1## with 'this is
	 *            replacement 2'
	 * 
	 */
	showPopup : function(title_key, message_key, placeholders) {
	    var title = this.get(title_key);
	    var message = this.get(message_key);

	    if (placeholders != null) {
		for ( var i = 0; i < placeholders.length; i++) {
		    //								var sandbox = Oskari.$().mapframework.runtime
		    //										.findSandbox();
		    var replacementKey = "##" + i + "##";
		    message = message.replace(replacementKey,
					      placeholders[i]);
		}
	    }

	    Ext.Msg.show( {
		title : title,
		msg : message,
		buttons : Ext.Msg.OK
	    });

	},

	/** Returns true if finnish is current language */
	isFiCurrentLanguage : function() {
	    return (this.currentLanguage == "fi");
	},

	/** Returns true if swedish is current language */
	isSvCurrentLanguage : function() {
	    return (this.currentLanguage == "sv");
	},

	/** Returns true if english is current language */
	isEnCurrentLanguage : function() {
	    return (this.currentLanguage == "en");
	},

	getLanguage : function() {
	    return this.currentLanguage;
	    /*
	     * if(this.isEnCurrentLanguage()){ return "en"; } else
	     * if(this.isSvCurrentLanguage()){ return "sv"; } else {
	     * return "fi"; }
	     */
	}
    },
    {
	'protocol' : ['Oskari.mapframework.service.Service']
    });

/* Inheritance */
