startup = {};
startup.layers = {
	layers : [
			{
				wmsName : "vtj_rakennusten_osoitenumerot",
				descriptionLink : "",
				orgName : "Väestörekisterikeskus",
				type : "wmslayer",
				baseLayerId : 24,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 92,
				minScale : 20000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=67f4eb88-5503-4fb7-9b62-43bef7b5cf19",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "VTJ Rakennusten osoitenumerot",
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_okartta_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_okartta_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 89,
				minScale : 20000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=08f343de-d1e6-4418-af09-9e74249f36d7",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere,http://wms.x.paikkatietoikkuna.fi/wms/tampere,http://wms.y.paikkatietoikkuna.fi/wms/tampere,http://wms.z.paikkatietoikkuna.fi/wms/tampere",
				name : "Tampereen opaskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_ykartta_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_ykartta_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 93,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				name : "Tampereen yleiskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_vkartta_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_vkartta_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 96,
				minScale : 25000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				name : "Tampereen virastokartta",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_meta_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_meta_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 98,
				minScale : 25000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=079e02ff-318d-4b57-9441-838806381128",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere,http://wms.x.paikkatietoikkuna.fi/wms/tampere,http://wms.y.paikkatietoikkuna.fi/wms/tampere,http://wms.z.paikkatietoikkuna.fi/wms/tampere",
				name : "Tampereen kantakartta",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_kaavat_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_kaavat_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 95,
				minScale : 8000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=32160608-74f1-478f-af22-082efe8c20c7",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				name : "Tampereen asemakaava",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_tonttijaot_gk24",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_tonttijaot_gk24",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 97,
				minScale : 8000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				name : "Tampereen tonttijako",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "tampere:tampere_kaavaidx",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_kaavaidx",
					name : "raster"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 94,
				minScale : 8000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a?SERVICE=WMS&",
				name : "Tampereen kaavaindeksi",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:AK_KAAVATYOT_VIEW",
				styles : {
					title : "Vireilla olevien kaavatoiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATYOT_VIEW",
					name : "vireilla_olevat_kaavatyot"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATILANNE&style=polygon",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 121,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen vireillä olevia kaavoja",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:AK_KAAVATILANNE",
				styles : [
						{
							title : "Default polygon style",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATILANNE&style=polygon",
							name : "polygon"
						},
						{
							title : "Kaavatilannekartan tyyli",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATILANNE",
							name : "tre_ak_kaavatilanne"
						} ],
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATILANNE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 126,
				minScale : 80000,
				style : "tre_ak_kaavatilanne",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen kaavatilannekartta",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:ASEMAKAAVAINDEKSI",
				styles : {
					title : "Asemakaavaindeksin tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ASEMAKAAVAINDEKSI",
					name : "tre_asemakaavaindeksi"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=AK_KAAVATILANNE&style=polygon",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 127,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=00f1cc89-7161-417c-8426-35d7506520de",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen asemakaavaindeksi",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:YK_KAAVA_ALUE",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YK_KAAVA_ALUE",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=tampere_ora:YK_KAAVA_ALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 183,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows?",
				name : "Tampereen yleiskaavaindeksi",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:YK_KT_ALUE",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YK_KT_ALUE",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YK_KT_ALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 128,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen yleiskaavan käyttötarkoitusalueet",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:RAK_KIELTOALUEET",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAK_KIELTOALUEET",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAK_KIELTOALUEET",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 129,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=36a49889-7853-42f2-81f8-be665713f2bb",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen rakennuskieltoalueet",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KI_YL_AL_INDEKSI",
				styles : [
						{
							title : "Default polygon style",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_YL_AL_INDEKSI&style=polygon",
							name : "polygon"
						},
						{
							title : "Yleisten alueiden toimituksien tyyli",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_YL_AL_INDEKSI",
							name : "yleisten_alueiden_toimituksien_indeksi"
						} ],
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_YL_AL_INDEKSI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 130,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen yleisen alueen indeksi",
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_SUURALUE",
				styles : {
					title : "Suuralueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_SUURALUE",
					name : "tre_suuralue"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_SUURALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 137,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen suuralueet",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_TILASTODATA_VIEW",
				styles : {
					title : "Hallinnollisten alueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_TILASTODATA_VIEW",
					name : "tre_hallinto"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_TILASTO",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 136,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen tilastoalueet",
				opacity : 100,
				inspire : "Tilastoyksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_SUUNNITTELUALUE",
				styles : {
					title : "Suunnittelualuetyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_SUUNNITTELUALUE",
					name : "tre_suunnittelualue"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_SUUNNITTELUALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 138,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen suunnittelualueet",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_AANESTYS",
				styles : {
					title : "Hallinnollisten alueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_AANESTYS",
					name : "tre_hallinto"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_AANESTYS",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 139,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen äänestysalueet",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_POSTIPIIRI",
				styles : {
					title : "Hallinnollisten alueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_POSTIPIIRI",
					name : "tre_hallinto"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_POSTIPIIRI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 140,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen postipiirit",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_YLA_ASTE",
				styles : {
					title : "Hallinnollisten alueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_YLA_ASTE",
					name : "tre_hallinto"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_YLA_ASTE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 135,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen koulualueet yläaste",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KH_ALA_ASTE",
				styles : {
					title : "Hallinnollisten alueiden tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_ALA_ASTE",
					name : "tre_hallinto"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KH_ALA_ASTE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 141,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen koulualueet ala-aste",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:KP_PISTEET_MVIEW",
				styles : {
					title : "Kiintopistetyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KP_PISTEET_MVIEW",
					name : "tre_kiintopiste"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KP_PISTEET_MVIEW",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 147,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen kiintopisteet",
				opacity : 100,
				inspire : "Koordinaattijärjestelmät",
				maxScale : 1
			},
			{
				wmsName : "tampere_ora:RAKENNUKSET_MVIEW",
				styles : {
					title : "Rakennustyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAKENNUKSET_MVIEW",
					name : "tre_rakennukset"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=RAKENNUKSET_MVIEW",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 178,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				name : "Tampereen rakennukset",
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				wmsName : "1",
				styles : {
					title : "Muinaisjäännökset",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjpiste.png",
					name : "1"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjpiste.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 15,
				minScale : 200000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Muinaisjäännökset",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "2",
				styles : {
					title : "Muinaisj.alakohteet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjalapiste.png",
					name : "2"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjalapiste.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 64,
				minScale : 35000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Muinaisjäännösten alakohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "3",
				styles : {
					title : "Muinaisjäännösalueet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjrajaus.png",
					name : "3"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/mjrajaus.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 65,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Muinaisjäännösalueet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "5",
				styles : {
					title : "Rakennukset",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/rapeapiste.png",
					name : "5"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/rapeapiste.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 16,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=2aacd6b1-af40-4897-aedb-85dad3facdf4",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Rakennusperintö",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "6",
				styles : {
					title : "Rakennetut alueet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/rapeaalue.png",
					name : "6"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 122,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=2aacd6b1-af40-4897-aedb-85dad3facdf4",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Rakennusperintökohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "11",
				styles : {
					title : "RKY pisteet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/rkypiste.png",
					name : "11"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/rkypiste.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 123,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "RKY - pistemäiset kohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "12",
				styles : {
					title : "RKY viivat",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/rkyviivat.png",
					name : "12"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/rkyviivat.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 124,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "RKY - viivamaiset kohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "13",
				styles : {
					title : "RKY alueet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/rkyalue.png",
					name : "13"
				},
				descriptionLink : "",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 125,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "RKY - aluemaiset kohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "8",
				styles : {
					title : "Maailmanperintö pisteet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/mppiste.png",
					name : "8"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maailmanperintokohteiden-paikkatiedot",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/mppiste.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 17,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Maailmanperintökohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "9",
				styles : {
					title : "Maailmanperintö alueet",
					legend : "http://kartta.nba.fi/arcgisoutput/wmsapu/mpalue.png",
					name : "9"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maailmanperintokohteiden-paikkatiedot",
				baseLayerId : 4,
				orgName : "Museovirasto",
				type : "wmslayer",
				legendImage : "http://kartta.nba.fi/arcgisoutput/wmsapu/mpalue.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 18,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				name : "Maailmanperintöalueet",
				opacity : 80,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				wmsName : "8",
				styles : {
					title : "Turvekartoitus",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/kartoitetut_turvealueet.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/kartoitetut_turvealueet.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 108,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Turvekartoitus",
				opacity : 100,
				inspire : "Energiavarat",
				maxScale : 1
			},
			{
				wmsName : "3",
				styles : {
					title : "Maaperäkartta 1:20 000 / 1:50 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta20k.png",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maaperakartta-1/20000",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta20k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 19,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=0f3f054f-ad70-4cf1-a1d1-93589261bd04",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Maaperäkartta 1:20 000 / 1:50 000",
				opacity : 75,
				inspire : "Geologia",
				maxScale : 10000
			},
			{
				wmsName : "7",
				styles : {
					title : "Digitaalinen maaperäkartta 1:200 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta200k.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta200k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 109,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=ade1283b-0e69-4166-a52a-261d04f32cd0",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Digitaalinen maaperäkartta 1:200 000",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 100000
			},
			{
				wmsName : "4",
				styles : {
					title : "Suomen maaperä 1:1 000 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta1M.png",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maaperakartta-1/1milj",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/maaperakartta1M.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 20,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=98dd3816-e223-4864-848b-f463796d0c29",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suomen maaperä 1:1 000 000",
				opacity : 75,
				inspire : "Geologia",
				maxScale : 500000
			},
			{
				wmsName : "Maapera_1M_WFS",
				styles : {},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 133,
				minScale : 40000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "wfs",
				name : "Suomen maaperä 1:1 000 000 (WFS)",
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "0",
				styles : {
					title : "Aeromagneettiset matalalentomittaukset",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/magneettikenttakartta.png",
					name : "default"
				},
				descriptionLink : "http://www.gtk.fi/",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/magneettikenttakartta.png",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 23,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=f4dde0c8-05d2-4f7b-99ed-b70f8aabe6e2",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Aeromagneettiset matalalentomittaukset",
				opacity : 75,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "5",
				styles : {
					title : "Suomen pintageologiakartta 1:1 000 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/pintageologia1M.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/pintageologia1M.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 111,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=8cf3b45c-85a7-471e-ac14-80dbc849c71e",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suomen pintageologiakartta 1:1 000 000",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 250000
			},
			{
				wmsName : "Pintageologia_1M_WFS",
				styles : {},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 132,
				minScale : 40000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "wfs",
				name : "Suomen pintageologiakartta 1:1 000 000 (WFS)",
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "6",
				styles : {
					title : "Digitaalinen kallioperäkartta 1:200 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/kallioperakartta200k.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/kallioperakartta200k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 110,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=f88b26f6-faea-4911-aaf4-40b1e25b37a0",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Digitaalinen kallioperäkartta 1:200 000",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 20000
			},
			{
				wmsName : "1",
				styles : {
					title : "kallioperakartta 1:100 000",
					legend : "http://geomaps2.gtk.fi/arcgisoutput/GTKWMS_MapServer/wms/default1.png",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/kallioperakartta-1/100000",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/arcgisoutput/GTKWMS_MapServer/wms/default1.png",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 21,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Kallioperäkartta 1:100 000",
				opacity : 75,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "2",
				styles : {
					title : "Suomen kallioperä 1:1 000 000",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/kallioperakartta1M.png",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/kallioperakartta-1/1milj",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/kallioperakartta1M.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 22,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=75839cb0-713d-418c-92d0-44bf216aa572",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suomen kallioperä 1:1 000 000",
				opacity : 75,
				inspire : "Geologia",
				maxScale : 250000
			},
			{
				wmsName : "Kalliopera_1M_WFS",
				styles : {},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 134,
				minScale : 40000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "wfs",
				name : "Suomen kallioperä 1:1 000 000 (WFS)",
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "9",
				styles : {
					title : "Suomen kallioperän ikämääritykset",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/ikamaaritys.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/ikamaaritys.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 153,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f660137-4f2a-48f0-8024-f8817ca6e75e",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suomen kallioperän ikämääritykset",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "10",
				styles : {
					title : "Kallioperä- ja lohkarehavaintoaineisto",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/paljastuma_lohkare.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/paljastuma_lohkare.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 154,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=588fbcfc-f7d1-4668-ab4c-c14d4796dfa6",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Kallioperä- ja lohkarehavaintoaineisto",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "11",
				styles : {
					title : "Suomen kalliogeokemian tietokanta",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/kalliogeokemia.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/kalliogeokemia.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 155,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=db8a66fa-e319-4c50-92e8-924db7693838",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suomen kalliogeokemian tietokanta",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "12",
				styles : {
					title : "Suuralueellinen moreenigeokemiallinen kartoitus",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/moreeni.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/moreeni.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 156,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=3cb8f375-202c-4671-bffb-51f9a64d8aca",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suuralueellinen moreenigeokemiallinen kartoitus",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "13",
				styles : {
					title : "Suuralueellinen purosedimenttigeokemiallinen kartoitus",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/purosedimentti.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/purosedimentti.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 157,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=463f5375-0fae-4dc5-af90-a8ebbf87035a",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suuralueellinen purosedimenttigeokemiallinen kartoitus",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "14",
				styles : {
					title : "Suuralueellinen purovesigeokemiallinen kartoitus",
					legend : "http://geomaps2.gtk.fi/GTKWMS/wms/purovesi.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 5,
				orgName : "Geologian tutkimuskeskus",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/GTKWMS/wms/purovesi.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 158,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=403968d6-af88-47b5-940b-f6278482378e",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				name : "Suuralueellinen purovesigeokemiallinen kartoitus",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				id : "base_3",
				minScale : 5000000,
				name : "Logica RS-kartat",
				subLayer : [
						{
							wmsName : "rs_taajamakartta_20k_0.500000m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 8,
							minScale : 15000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_taajamakartta_20k/",
							name : "Logica taajamakartta 1:20k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 1
						},
						{
							wmsName : "rs_kuntakartta_50k_1.250000m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 9,
							minScale : 30000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_kuntakartta_50k/",
							name : "Logica kuntakartta 1:50k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 15000
						},
						{
							wmsName : "rs_seutukartta_100k_2.500000m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 10,
							minScale : 50000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_seutukartta_100k/",
							name : "Logica seutukartta 1:100k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 31000
						},
						{
							wmsName : "rs_yleiskartta_250k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 11,
							minScale : 150000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_yleiskartta_250k/",
							name : "Logica yleiskartta 1:250k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 50000
						},
						{
							wmsName : "rs_maakuntakartta_500k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 12,
							minScale : 300000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_maakuntakartta_500k/",
							name : "Logica maakuntakartta 1:500k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 150000
						},
						{
							wmsName : "rs_suomi_1m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 13,
							minScale : 600000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_suomi_1m/",
							name : "Logica Suomi 1:1milj",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 300000
						},
						{
							wmsName : "rs_suomi_5m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rs-karttasarja",
							orgName : "Logica RS-kartat",
							type : "wmslayer",
							baseLayerId : 3,
							legendImage : "",
							formats : {
								value : "text/plain"
							},
							isQueryable : false,
							id : 14,
							minScale : 5000000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_suomi_5m/",
							name : "Logica Suomi 1:5milj",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 600000
						} ],
				styles : {},
				baseLayerId : 3,
				maxScale : 1,
				type : "base",
				inspire : "Logica RS-kartat",
				orgName : "Taustakartat",
				isQueryable : false,
				formats : {}
			},
			{
				wmsName : "katselupalvelu:digiroad",
				styles : {
					title : "Digiroad",
					legend : "http://kartta.liikennevirasto.fi/maaliikenne/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=digiroad",
					name : "Digiroad"
				},
				descriptionLink : "",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://kartta.liikennevirasto.fi/maaliikenne/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=digiroad",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 77,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=34155a94-b58b-4ad0-87e6-f96d2db0f3ba",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				name : "Digiroad",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "katselupalvelu:rataverkko",
				styles : {
					title : "Rataverkko",
					legend : "http://kartta.liikennevirasto.fi/maaliikenne/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=rataverkko",
					name : "Rataverkko"
				},
				descriptionLink : "",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://kartta.liikennevirasto.fi/maaliikenne/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=rataverkko",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 174,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=41b95d0a-99cd-4cb7-be57-33723938249c",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				name : "Rataverkko",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "katselupalvelu:tasoristeykset",
				styles : {
					title : "Tasoristeykset",
					legend : "http://kartta.liikennevirasto.fi/maaliikenne/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=tasoristeykset",
					name : "tasoristeykset"
				},
				descriptionLink : "",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://kartta.liikennevirasto.fi/maaliikenne/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=tasoristeykset",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 176,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=2d61d8a4-6a5b-49d0-9e3d-279a3071864c",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				name : "Tasoristeykset",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "katselupalvelu:Tierekisterin osoitteisto",
				styles : {
					title : "Tieosoiteverkko",
					legend : "http://kartta.liikennevirasto.fi/maaliikenne/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=Tierekisterin+osoitteisto",
					name : "Tieosoiteverkko"
				},
				descriptionLink : "",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://kartta.liikennevirasto.fi/maaliikenne/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=katselupalvelu:Tierekisterin osoitteisto",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 175,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=91bdc4b3-72db-46d6-b542-a1e6d3f68095",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				name : "Tieosoiteverkko",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "cells",
				styles : [
						{
							title : "Base transparent land",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-261&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-261"
						},
						{
							title : "default",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-200&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-200"
						},
						{
							title : "Full ECDIS",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-260&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-260"
						},
						{
							title : "transparent land",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-201&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-201"
						},
						{
							title : "Standard",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-246&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-246"
						},
						{
							title : "Full",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-245&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-245"
						},
						{
							title : "Full transparent land",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-263&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-263"
						},
						{
							title : "Base",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-244&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-244"
						},
						{
							title : "Standard transparent land",
							legend : "https://services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-262&FORMAT=image/png&WIDTH=200&HEIGHT=442",
							name : "style-id-262"
						} ],
				descriptionLink : "http://geonetwork.nls.fi/geonetwork/srv/en/csw?request=GetRecordById&service=CSW&id=0ed278a4-512d-4534-95ff-0eb873ac3711&elementSetName=full&outputSchema=http://www.isotc211.org/2005/gmd",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://wms.w.paikkatietoikkuna.fi/wms/services.ecc.no/wms/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-262&FORMAT=image/png&WIDTH=200&HEIGHT=442",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 27,
				minScale : 2000000,
				style : "style-id-262",
				dataUrl : "/catalogue/ui/metadata.html?uuid=1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/services.ecc.no/wms/wms?",
				name : "Elektroniset merikartat (ENC)",
				opacity : 75,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "coverage",
				styles : [ {
					title : "Default",
					name : "default"
				}, {
					title : "Label",
					name : "label"
				}, {
					title : "Highlight",
					name : "highlight"
				} ],
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/merikartta-aineisto",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 31,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/services.ecc.no/wms/wms?",
				name : "ENC-kattavuusalueet",
				opacity : 50,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "Peltolohkot2008",
				styles : {
					title : "default",
					legend : "https://ilmakuva.mmm.fi/cgi-bin/MaviPaikkatietoikkuna?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=Peltolohkot2008&format=image/png; mode=24bit&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/peltolohkorekisteri",
				baseLayerId : 8,
				orgName : "Maaseutuvirasto",
				type : "wmslayer",
				legendImage : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/MaviPaikkatietoikkuna?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=kaikki&format=image/png&STYLE=default",
				formats : {
					value : "text/plain"
				},
				isQueryable : false,
				id : 34,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=4e335194-7b87-45c5-ad4f-792baaf90433",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/MaviPaikkatietoikkuna?",
				name : "Peltolohkorekisteri 2010",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "nimiston_kyselypalvelu",
				styles : {},
				descriptionLink : "",
				baseLayerId : 15,
				orgName : "Maanmittauslaitos",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 131,
				minScale : 28347,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=7d0b6514-d7f4-41b2-81c4-1f9f13aa8180",
				wmsUrl : "wfs",
				name : "Nimistön kyselypalvelu",
				opacity : 100,
				inspire : "Paikannimet",
				maxScale : 1
			},
			{
				wmsName : "ortokuva",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/ortokuvat",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 24,
				minScale : 50000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Ortoilmakuva",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "ortokuva_vaaravari",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/ortokuvat",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 25,
				minScale : 50000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				name : "Väärävärikuva",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "mtk_nimet",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 43,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=eec8a276-a406-4b0a-8896-741cd716ade6",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Paikannimet",
				opacity : 100,
				inspire : "Paikannimet",
				maxScale : 1
			},
			{
				wmsName : "mtk_tienimet",
				descriptionLink : "",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 91,
				minScale : 20000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1890eb1-e25e-4652-9596-ce72f6d7fcf0",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Tienimet",
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				wmsName : "mtk_liikenneverkko",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 41,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Liikenneverkko",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "mtk_vesistot",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 35,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Vesi",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 1
			},
			{
				wmsName : "mtk_korkeuskayrat",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 36,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Korkeuskäyrät",
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "mtk_hallintorajat",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 37,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Hallintorajat",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "mtk_rakennukset",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 39,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Rakennukset",
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				wmsName : "mtk_kalliot_ja_hietikot",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 42,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Kalliot ja hietikot",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "mtk_pellot",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 61,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Pellot",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				wmsName : "mtk_avoimet_metsamaat",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 44,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Avoimet metsämaat",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				wmsName : "mtk_suot",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 58,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Suot",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				wmsName : "mtk_pohjakuviot",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 59,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Pohjakuviot",
				opacity : 100,
				inspire : "Maastokartat",
				maxScale : 1
			},
			{
				wmsName : "ows:ruudut",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 60,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Karttalehtijaot",
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				wmsName : "ows:mml_toimipiste",
				descriptionLink : "",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 85,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "MML toimipisteet",
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				wmsName : "ows:mml_toimialue",
				descriptionLink : "",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 86,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "MML toimialueet",
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				wmsName : "ProtectedSites.NatureConservation",
				styles : {
					title : "ProtectedSites.NatureConservation",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.NatureConservation",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.NatureConservation",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 100,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=76b8f23c-5df2-43ba-9c39-fe0e2b41242e",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				name : "Luonnonsuojelu- ja erämaa-alueet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				wmsName : "ProtectedSites.Natura2000Lines",
				styles : {
					title : "ProtectedSites.Natura2000Lines",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.Natura2000Lines",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.Natura2000Lines",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 102,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=eea8c157-33e3-4f71-b5db-7939222a790a",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				name : "Natura2000 viivamaiset kohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				wmsName : "ProtectedSites.Natura2000Polygons",
				styles : {
					title : "ProtectedSites.Natura2000Polygons",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.Natura2000Polygons",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=ProtectedSites.Natura2000Polygons",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 101,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=eea8c157-33e3-4f71-b5db-7939222a790a",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				name : "Natura2000 aluemaiset kohteet",
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				wmsName : "PhysicalWaters.Catchments.RiverBasin",
				styles : {
					title : "PhysicalWaters.Catchments.RiverBasin",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=PhysicalWaters.Catchments.RiverBasin",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=PhysicalWaters.Catchments.RiverBasin",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 103,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e907f731-7244-4549-a83f-5a73e7de1071",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				name : "Päävesistöalueet",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				wmsName : "PhysicalWaters.Catchments.DrainageBasin",
				styles : {
					title : "PhysicalWaters.Catchments.DrainageBasin",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=PhysicalWaters.Catchments.DrainageBasin",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=PhysicalWaters.Catchments.DrainageBasin",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 104,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e907f731-7244-4549-a83f-5a73e7de1071",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				name : "Valuma-alueet",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				wmsName : "Reporting.WFDRiver",
				styles : {
					title : "Reporting.WFDRiver",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDRiver%26width=220%26height=70",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDRiver%26width=220%26height=70",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 107,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				name : "VPD Joki",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				wmsName : "Reporting.WFDLake",
				styles : {
					title : "Reporting.WFDLake",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDLake%26width=220%26height=70",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDLake%26width=220%26height=70",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 106,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				name : "VPD Järvi",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				wmsName : "Reporting.WFDCoastalWater",
				styles : {
					title : "Reporting.WFDCoastalWater",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDCoastalWater%26width=220%26height=60",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Reporting.WFDCoastalWater%26width=220%26height=60",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 105,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				name : "VPD Rannikkovesi",
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				wmsName : "Syvyyspiste",
				styles : {
					title : "Syvyyspiste",
					legend : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyyspiste",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyyspiste",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 164,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				name : "Järvien syvyyspisteet",
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "Syvyyskayra",
				styles : {
					title : "Syvyyskayra",
					legend : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyyskayra",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyyskayra",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 163,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				name : "Järvien syvyyskäyrät",
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "Syvyysalue",
				styles : {
					title : "Syvyysalue",
					legend : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyysalue%26width=100%26height=280",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Syvyysalue%26width=100%26height=280",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 165,
				minScale : 250000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				name : "Järvien syvyysalueet",
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "Pohjavesialuerajat",
				styles : {
					title : "Pohjavesialuerajat",
					legend : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Pohjavesialuerajat%26width=220%26height=150",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Pohjavesialuerajat%26width=220%26height=150",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 167,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer",
				name : "Pohjavesialuerajat",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				wmsName : "Pohjavesialue",
				styles : {
					title : "Pohjavesialue",
					legend : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Pohjavesialue",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/arcgis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Pohjavesialue",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 166,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer",
				name : "Pohjavesialueet",
				opacity : 100,
				inspire : "Geologia",
				maxScale : 10000
			},
			{
				wmsName : "CorineLandCover2000_25m",
				styles : {
					title : "CorineLandCover2000_25m",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2000_25m",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2000_25m",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 168,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=d38853db-61df-481f-a60b-060fca484111",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				name : "Corine Land Cover 2000, 25 m",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				wmsName : "CorineLandCover2000_25ha",
				styles : {
					title : "CorineLandCover2000_25ha",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2000_25ha%26width=220%26height=48",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2000_25ha%26width=220%26height=48",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 169,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=d38853db-61df-481f-a60b-060fca484111",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				name : "Corine Land Cover 2000, 25 ha",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				wmsName : "CorineLandCover2006_25m",
				styles : {
					title : "CorineLandCover2006_25m",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2006_25m",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2006_25m",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 170,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e3deb283-d66b-4876-83f4-9d5014745725",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				name : "Corine Land Cover 2006, 25 m",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				wmsName : "CorineLandCover2006_25ha",
				styles : {
					title : "CorineLandCover2006_25ha",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2006_25ha%26width=220%26height=48",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CorineLandCover2006_25ha%26width=220%26height=48",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 171,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=e3deb283-d66b-4876-83f4-9d5014745725",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				name : "Corine Land Cover 2006, 25 ha",
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				wmsName : "Image2000mosaiikki",
				styles : {
					title : "Image2000mosaiikki",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Image2000mosaiikki%26width=50%26height=48",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Image2000mosaiikki%26width=50%26height=48",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 172,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=3c80ee05-8597-4e80-a5a1-bd9e1db771be",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer",
				name : "Image 2000 mosaiikki",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "Image2006mosaiikki",
				styles : {
					title : "Image2006mosaiikki",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Image2006mosaiikki%26width=50%26height=48",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/Services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Image2006mosaiikki%26width=50%26height=48",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 173,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=b18f6b82-357c-4297-9c70-013fda41370e",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer",
				name : "Image 2006 mosaiikki",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "rinnevalovarjostus",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/rinnevalovarjostus",
				orgName : "Geodeettinen laitos",
				type : "wmslayer",
				baseLayerId : 11,
				legendImage : "http://217.152.180.25/cgi-bin/rinnevalo_wms?",
				formats : {
					value : "text/plain"
				},
				isQueryable : false,
				id : 40,
				minScale : 10000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo",
				name : "Rinnevalovarjostus",
				opacity : 50,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "rinnevalovarjostus_vari",
				descriptionLink : "",
				orgName : "Geodeettinen laitos",
				type : "wmslayer",
				baseLayerId : 11,
				legendImage : "http://217.152.180.24/cgi-bin/wms_rinnevalo",
				formats : {
					value : "text/plain"
				},
				isQueryable : false,
				id : 179,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo",
				name : "Rinnevalovarjostus (värillinen)",
				opacity : 50,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				wmsName : "ows:slices",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/slices",
				orgName : "Yhteistyöaineistot",
				type : "wmslayer",
				baseLayerId : 12,
				legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=slices",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 32,
				minScale : 10000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=79accb35-b7e9-4356-bfd2-c4b453e34ed8",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "SLICES",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "ktj_kiinteistorajat",
				descriptionLink : "",
				orgName : "Yhteistyöaineistot",
				type : "wmslayer",
				baseLayerId : 12,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 90,
				minScale : 15999,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=472b3e52-5ba8-4967-8785-4fa13955b42e",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Kiinteistöjaotus (päivitetään kerran kuussa)",
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				wmsName : "ktj_kiinteistotunnukset",
				descriptionLink : "",
				orgName : "Yhteistyöaineistot",
				type : "wmslayer",
				baseLayerId : 12,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 99,
				minScale : 3999,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=472b3e52-5ba8-4967-8785-4fa13955b42e",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "Kiinteistötunnukset",
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				wmsName : "maakuntakaava",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				baseLayerId : 13,
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_aluevaraus&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 51,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S vahvistetut maakuntakaavat",
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_aluevaraus",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_aluevaraus&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_aluevaraus&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 52,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan alueidenkäyttö",
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_osaalueet",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_osaalueet&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_osaalueet&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 79,
				minScale : 1200000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan osa-alueet",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_tiet",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_tiet&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_tiet&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 80,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan liikenne",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_reitit",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_reitit&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_reitit&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 81,
				minScale : 2000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan reitit ja väylät",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_johdot",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_johdot&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_johdot&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 82,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan johtoverkko",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_kehper",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_kehper&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_kehper&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 83,
				minScale : 1200000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan kehittämisperiaatteet",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "mk_kohteet",
				styles : {
					title : "default",
					legend : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=mk_kohteet&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/fi/varsinais-suomen-maakuntakaavat",
				baseLayerId : 13,
				orgName : "Varsinais-Suomen liitto",
				type : "wmslayer",
				legendImage : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=mk_kohteet&format=image/png&STYLE=default",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 78,
				minScale : 500000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				name : "V-S maakuntakaavan kohteet",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "OSM_tiet",
				styles : {
					title : "default",
					legend : "https://ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=OSM_tiet&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/openstreetmap",
				baseLayerId : 14,
				orgName : "Vapaat sisällöt",
				type : "wmslayer",
				legendImage : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=OSM_tiet&format=image/png&STYLE=default",
				formats : {
					value : "text/plain"
				},
				isQueryable : true,
				id : 54,
				minScale : 1000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				name : "OpenStreetMap 09/2011",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "OSM_rakennukset",
				styles : {
					title : "default",
					legend : "https://ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=OSM_rakennukset&format=image/png&STYLE=default",
					name : "default"
				},
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/openstreetmap",
				baseLayerId : 14,
				orgName : "Vapaat sisällöt",
				type : "wmslayer",
				legendImage : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?version=1.1.1&service=WMS&request=GetLegendGraphic&layer=OSM_rakennukset&format=image/png&STYLE=default",
				formats : {
					value : "text/plain"
				},
				isQueryable : true,
				id : 55,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				name : "OpenStreetMap rakennukset 09/2011",
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				wmsName : "Landsat742",
				descriptionLink : "",
				orgName : "Vapaat sisällöt",
				type : "wmslayer",
				baseLayerId : 14,
				legendImage : "",
				formats : {
					value : "text/plain"
				},
				isQueryable : false,
				id : 53,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				name : "Landsat-kuva",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "Opaskartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/espoon-opaskartta-1/20000",
				orgName : "Espoon kaupunki",
				type : "wmslayer",
				baseLayerId : 16,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 28,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=34524f11-c11c-482d-a83e-48895572cc76",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				name : "Espoon opaskartta",
				opacity : 75,
				inspire : "Opaskartat",
				maxScale : 4000
			},
			{
				wmsName : "Osoitekartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/espoon-osoitekartta-1/5000",
				orgName : "Espoon kaupunki",
				type : "wmslayer",
				baseLayerId : 16,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 29,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=2f642310-df2d-4334-b2e4-a8ad747f96dd",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				name : "Espoon osoitekartta",
				opacity : 75,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				wmsName : "Maankayttokartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/espoon-maankayttokartta",
				orgName : "Espoon kaupunki",
				type : "wmslayer",
				baseLayerId : 16,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 30,
				minScale : 100000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=4a66aebd-9b47-4fe1-a9b1-3f34b43229d0",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				name : "Espoon maankäyttökartta",
				opacity : 75,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "ows:UTM-lehtijako 1_25000",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Karttalehtijaot",
				type : "wmslayer",
				baseLayerId : 17,
				legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_25000",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 63,
				minScale : 10000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "TM35-lehtijako 1:25000",
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				wmsName : "ows:UTM-lehtijako 1_50000",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Karttalehtijaot",
				type : "wmslayer",
				baseLayerId : 17,
				legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_50000",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 62,
				minScale : 10000000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat?",
				name : "TM35-lehtijako 1:50000",
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				wmsName : "Asemakaavakartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-ajantasa-asemakaava",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 72,
				minScale : 30000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=9ab8a5a8-e869-4568-85a2-2f9eae4acadd",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän asemakaavakartta",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "Maastokartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-maastokartta",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 66,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän maastokartta",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "Ilmakuva",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-ortoilmakuva",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 67,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän ilmakuva",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "Opaskartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-opaskartta-1-20000",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 68,
				minScale : 150000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=89c6a379-776f-4529-b79d-a456177fb64d",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän opaskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "Aanestysalueet",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-aanestysalueet",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 69,
				minScale : 60000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän äänestysalueet",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "Postialueet",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-postialueet",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 70,
				minScale : 60000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän postialueet",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "Kaupunginosat",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-kaupunginosat",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 71,
				minScale : 60000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän kaupunginosat",
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				wmsName : "Ulkoilukartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-ulkoilukartta",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 73,
				minScale : 30000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän ulkoilukartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "Linja-autoreitit",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/jyvaskylan-linja-autoreitit",
				orgName : "Jyväskylän kaupunki",
				type : "wmslayer",
				baseLayerId : 18,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 74,
				minScale : 30000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				name : "Jyväskylän linja-autoreitit",
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				wmsName : "Asemakaava",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/turun-ajantasa-asemakaava",
				orgName : "Turun kaupunki",
				type : "wmslayer",
				baseLayerId : 19,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 56,
				minScale : 50000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1e92bf3-758a-4fc1-87e1-dca692304379",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",
				name : "Turun asemakaavayhdelmä",
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "Pohjakartta",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/turun-kantakartta",
				orgName : "Turun kaupunki",
				type : "wmslayer",
				baseLayerId : 19,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 57,
				minScale : 5000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1e92bf3-758a-4fc1-87e1-dca692304379",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",
				name : "Turun asemakaavan pohjakartta",
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				wmsName : "pkartta:toimipaikat",
				styles : {
					title : "geoserver style",
					legend : "http://kartta.suomi.fi/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=toimipaikat",
					name : "toimipaikat_style"
				},
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Valtiokonttori",
				type : "wmslayer",
				legendImage : "http://kartta.suomi.fi/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=toimipaikat",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 143,
				minScale : 160000,
				style : "",
				dataUrl : "/catalogue/linkitys.html?puuttuu=on",
				wmsUrl : "http://kartta.suomi.fi/geoserver/wms?",
				name : "Palvelupisteet",
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				styles : {},
				orgName : "Taustakartat",
				type : "base",
				baseLayerId : 22,
				formats : {},
				isQueryable : false,
				id : "base_22",
				minScale : 15000000,
				dataUrl : "",
				name : "Logica taustakartat",
				subLayer : [ {
					wmsName : "logica_ykj",
					descriptionLink : "",
					orgName : "Logica taustakartat",
					type : "wmslayer",
					baseLayerId : 22,
					legendImage : "",
					formats : {
						value : "text/plain"
					},
					isQueryable : false,
					id : 88,
					minScale : 15000000,
					style : "",
					dataUrl : "/catalogue/linkitys.html?puuttuu=on",
					wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/logica_ykj/",
					name : "Logica taustakarttasarja",
					opacity : 100,
					inspire : "Opaskartat",
					maxScale : 1
				} ],
				inspire : "Logica taustakartat",
				maxScale : 1
			},
			{
				styles : {},
				orgName : "Taustakartat",
				type : "base",
				baseLayerId : 2,
				formats : {},
				isQueryable : false,
				id : "base_2",
				minScale : 9000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				name : "Maastokartta",
				subLayer : [
						{
							wmsName : "peruskartta",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 75,
							minScale : 25000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=a6f8ec61-c717-4988-9692-76e766dea937",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Peruskartta 1:20k",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 1
						},
						{
							wmsName : "maastokartta_50k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 1,
							minScale : 54000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=d47ac165-6abd-4357-a4f9-a6f17e2b0c58",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Maastokartta 1:50k",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 26000
						},
						{
							wmsName : "maastokartta_100k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 2,
							minScale : 130000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=e9861577-efd5-4448-aded-6131f9d14097",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Maastokartta 1:100k",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 55000
						},
						{
							wmsName : "maastokartta_250k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 3,
							minScale : 245000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=a2cd4d67-ee20-47b7-b899-a4d72e72bb2d",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Maastokartta 1:250k",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 135000
						},
						{
							wmsName : "maastokartta_500k",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 76,
							minScale : 550000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Maastokartta 1:500k",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 280000
						},
						{
							wmsName : "yleiskartta_1m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 4,
							minScale : 1350000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=980fa404-75d3-4afd-b97e-bf1a9e392cd9",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Yleiskartta 1:1milj",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 560000
						},
						{
							wmsName : "yleiskartta_2m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 5,
							minScale : 2500000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Yleiskartta 1:2milj",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 1380000
						},
						{
							wmsName : "yleiskartta_4m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 6,
							minScale : 5000000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=bb491154-4f95-4b47-b0a3-cf9e1a0a78cc",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Yleiskartta 1:4milj",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 2600000
						},
						{
							wmsName : "yleiskartta_8m",
							descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
							orgName : "Maastokartta",
							type : "wmslayer",
							baseLayerId : 2,
							legendImage : "http://xml.nls.fi/Rasteriaineistot/Merkkienselitykset/2010/01/peruskartta_mk25000.png",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 7,
							minScale : 9000000,
							style : "",
							dataUrl : "/catalogue/linkitys.html?puuttuu=on",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Yleiskartta 1:8milj",
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 5100000
						} ],
				inspire : "Maastokartta",
				maxScale : 1
			},
			{
				wmsName : "Opaskartta",
				descriptionLink : "",
				orgName : "Helsingin kaupunki",
				type : "wmslayer",
				baseLayerId : 31,
				legendImage : "",
				formats : {
					value : "text/xml"
				},
				isQueryable : false,
				id : 152,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=7a492bca-7107-4ed4-a4ca-4e951cb8bcea",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/helsinki",
				name : "Helsingin opaskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "Ajantasa-asemakaava",
				descriptionLink : "",
				orgName : "Helsingin kaupunki",
				type : "wmslayer",
				baseLayerId : 31,
				legendImage : "",
				formats : {
					value : "text/xml"
				},
				isQueryable : false,
				id : 162,
				minScale : 40000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=f321f8eb-cc4b-4c4d-ac8a-0dc97306119c",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/helsinki",
				name : "Helsingin ajantasa-asemakaava",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "Asemakaava",
				descriptionLink : "",
				orgName : "Oulun kaupunki",
				type : "wmslayer",
				baseLayerId : 32,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 160,
				minScale : 40000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=2c7ca8c6-a47d-4209-8696-6545f2fae8b7",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				name : "Oulun asemakaava",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "Ilmakuva",
				descriptionLink : "",
				orgName : "Oulun kaupunki",
				type : "wmslayer",
				baseLayerId : 32,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 161,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=b24ee665-4b2b-4d4b-bbff-135c20180d1d",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				name : "Oulun ilmakuva 2004",
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				wmsName : "Opaskartta",
				descriptionLink : "",
				orgName : "Oulun kaupunki",
				type : "wmslayer",
				baseLayerId : 32,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 159,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=ad7a0bdd-eb14-4545-b76a-2b3f37733328",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				name : "Oulun opaskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "Osoitekartta",
				descriptionLink : "",
				orgName : "Oulun kaupunki",
				type : "wmslayer",
				baseLayerId : 32,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 177,
				minScale : 20000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=1fd2501a-1f49-4c93-939a-5f3b8216d16d",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				name : "Oulun osoitekartta",
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				wmsName : "Opaskartta",
				styles : {},
				descriptionLink : "",
				baseLayerId : 29,
				orgName : "Vihdin kunta",
				type : "wmslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 148,
				minScale : 80000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=1ebaa413-6e87-4664-a2f1-b47228ed35b7",
				wmsUrl : "http://mbl.vihti.fi/VihtiWMS.mapdef?service=WMS&version=1.1.1",
				name : "Vihdin opaskartta",
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				wmsName : "8",
				styles : {
					title : "Voimassa olevat kaivospiirit",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_v.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_v.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 120,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Voimassa olevat kaivospiirit",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "7",
				styles : {
					title : "Kaivospiirihakemukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_h.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_h.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 119,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Kaivospiirihakemukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "6",
				styles : {
					title : "Karenssissa olevat kaivospiirit",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_k.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/kaivosp_k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 118,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Karenssissa olevat kaivospiirit",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "5",
				styles : {
					title : "Voimassa olevat valtaukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_v.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_v.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 117,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Voimassa olevat valtaukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "4",
				styles : {
					title : "Valtaushakemukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_h.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_h.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 116,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Valtaushakemukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "3",
				styles : {
					title : "Karenssissa olevat valtaukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_k.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/valtaus_k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 115,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Karenssissa olevat valtaukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "2",
				styles : {
					title : "Voimassa olevat varaukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_v.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_v.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 114,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Voimassa olevat varaukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "1",
				styles : {
					title : "Varaushakemukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_h.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_h.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 113,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Varaushakemukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				wmsName : "0",
				styles : {
					title : "Karenssissa olevat varaukset",
					legend : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_k.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 26,
				orgName : "Turvallisuus- ja kemikaalivirasto",
				type : "wmslayer",
				legendImage : "http://geomaps2.gtk.fi/TEMWMS/wms/varaus_k.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 112,
				minScale : 15000000,
				style : "",
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				name : "Karenssissa olevat varaukset",
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				styles : {},
				orgName : "Taustakartat",
				type : "base",
				baseLayerId : 35,
				formats : {},
				isQueryable : false,
				id : "base_35",
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
				name : "Taustakartta",
				subLayer : [
						{
							wmsName : "taustakartta_5k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 184,
							minScale : 5000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:5000",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 1
						},
						{
							wmsName : "taustakartta_10k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 185,
							minScale : 20000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:10k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 5001
						},
						{
							wmsName : "taustakartta_20k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 186,
							minScale : 54000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:20k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 21000
						},
						{
							wmsName : "taustakartta_40k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 187,
							minScale : 133000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:40k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 55000
						},
						{
							wmsName : "taustakartta_80k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 188,
							minScale : 180000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:80k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 180000
						},
						{
							wmsName : "taustakartta_160k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 189,
							minScale : 250000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:160k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 133000
						},
						{
							wmsName : "taustakartta_320k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 190,
							minScale : 350000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:320k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 250000
						},
						{
							wmsName : "taustakartta_800k",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 191,
							minScale : 800000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:800k",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 351000
						},
						{
							wmsName : "taustakartta_2m",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 192,
							minScale : 2000000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:2milj",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 801000
						},
						{
							wmsName : "taustakartta_4m",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 193,
							minScale : 4000000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:4milj",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 2000001
						},
						{
							wmsName : "taustakartta_8m",
							descriptionLink : "",
							orgName : "Taustakartta",
							type : "wmslayer",
							baseLayerId : 35,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 194,
							minScale : 15000000,
							style : "",
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
							name : "Taustakartta 1:8milj",
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 4000001
						} ],
				inspire : "Taustakartta",
				maxScale : 1
			} ]
};
startup.mapConfigurations = {
	scale : 0,
	index_map : true,
	plane_list : true,
	width : 1000,
	north : "7216000",
	zoom_bar : true,
	pan : true,
	footer : true,
	height : 400,
	map_function : true,
	east : "476000",
	portletId : "108545_LAYOUT_MapFull2_WAR_map2portlet",
	scala_bar : true
};
startup.preSelectedLayers = {
	preSelectedLayers : [ {
		id : "base_35",
		isBase : true,
		name : "Taustakartta"
	} ]
};
startup.globalMapAjaxUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=ajax.jsp";
startup.globalMapPngUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=png.jsp";
startup.globalPortletNameSpace = "_MapFull2_WAR_map2portlet_";
startup.userInterfaceLanguage = "fi";
startup.imageLocation = "/map-application-framework";
startup.indexMapUrl = "/map-application-framework/resource/images/suomi25m_tm35fin.png";
startup.instructionsUrl = "http://www.paikkatietoikkuna.fi/web/fi/karttaikkunan-pikaopas";
startup.instructionsText = "Ohjeet";
startup.ogcSearchServiceEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=json.jsp";
startup.netServiceCenterEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=ajax.jsp";
startup.secureViewUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=secureView";
startup.bundles = [];
startup.disableDevelopmentMode = "true";
startup.useGetFeatureInfoProxy = "true";
startup.printUrl = "/widget/web/fi/kartta-tulostus/-/MapPrint2_WAR_map2portlet";
startup.printWindowWidth = "800";
startup.printWindowHeight = "800";