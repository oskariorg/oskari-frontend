
Oskari.$("allLayers",{
	layers : [
			{
				dataUrl_uuid : "b2d88dec-837e-4136-98ed-a937234eadfa",
				wmsName : "Metla:keskipituus",
				styles : {
					title : "Mean Height",
					legend : "http://kartta.metla.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=keskipituus",
					name : "keskip"
				},
				descriptionLink : "",
				baseLayerId : 37,
				orgName : "Metsäntutkimuslaitos",
				type : "wmslayer",
				legendImage : "http://kartta.metla.fi:80/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=keskipituus",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 202,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=b2d88dec-837e-4136-98ed-a937234eadfa",
				style : "",
				wmsUrl : "http://kartta.metla.fi/geoserver/ows?",
				orderNumber : 85,
				name : "Puuston keskipituus 2006",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b2d88dec-837e-4136-98ed-a937234eadfa",
				wmsName : "Metla:latvuspeitto",
				styles : {
					title : "Crown Cover Percentage",
					legend : "http://kartta.metla.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=latvuspeitto",
					name : "latvp"
				},
				descriptionLink : "",
				baseLayerId : 37,
				orgName : "Metsäntutkimuslaitos",
				type : "wmslayer",
				legendImage : "http://kartta.metla.fi:80/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=latvuspeitto",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 203,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=b2d88dec-837e-4136-98ed-a937234eadfa",
				style : "",
				wmsUrl : "http://kartta.metla.fi/geoserver/ows?",
				orderNumber : 86,
				name : "Puuston latvuspeitto 2006",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b2d88dec-837e-4136-98ed-a937234eadfa",
				wmsName : "Metla:lp_latvuspeitto",
				styles : {
					title : "Crown Cover Percentage",
					legend : "http://kartta.metla.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=lp_latvuspeitto",
					name : "lplatvp"
				},
				descriptionLink : "",
				baseLayerId : 37,
				orgName : "Metsäntutkimuslaitos",
				type : "wmslayer",
				legendImage : "http://kartta.metla.fi:80/geoserver/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=lp_latvuspeitto",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 204,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=b2d88dec-837e-4136-98ed-a937234eadfa",
				style : "",
				wmsUrl : "http://kartta.metla.fi/geoserver/ows?",
				orderNumber : 87,
				name : "Lehtipuuston latvuspeitto 2006",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				id : "base_3",
				minScale : 5000000,
				name : "Logica RS-kartat",
				subLayer : [
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_taajamakartta_20k/",
							orderNumber : 200,
							name : "Logica taajamakartta 1:20k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 1
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_kuntakartta_50k/",
							orderNumber : 201,
							name : "Logica kuntakartta 1:50k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 15000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_seutukartta_100k/",
							orderNumber : 202,
							name : "Logica seutukartta 1:100k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 31000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_yleiskartta_250k/",
							orderNumber : 203,
							name : "Logica yleiskartta 1:250k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 50000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_maakuntakartta_500k/",
							orderNumber : 204,
							name : "Logica maakuntakartta 1:500k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 150000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_suomi_1m/",
							orderNumber : 205,
							name : "Logica Suomi 1:1milj",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 300000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/rs_suomi_5m/",
							orderNumber : 206,
							name : "Logica Suomi 1:5milj",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 600000
						} ],
				styles : {},
				baseLayerId : 3,
				maxScale : 1,
				inspire : "Taustakartat",
				orgName : "Taustakartat",
				type : "base",
				isQueryable : false,
				formats : {}
			},
			{
				styles : {},
				type : "base",
				orgName : "Taustakartat",
				baseLayerId : 22,
				formats : {},
				isQueryable : false,
				id : "base_22",
				minScale : 15000000,
				dataUrl : "",
				name : "Logica taustakartat",
				subLayer : [ {
					dataUrl_uuid : "",
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
					dataUrl : "",
					style : "",
					wmsUrl : "http://mapstream.navici.com/wms/a482f2cc97880131c5068182b9febb55/ykj/logica_ykj/",
					orderNumber : 100,
					name : "Logica taustakarttasarja",
					permissions : {
						publish : -1
					},
					opacity : 100,
					inspire : "Opaskartat",
					maxScale : 1
				} ],
				inspire : "Taustakartat",
				maxScale : 1
			},
			{
				styles : {},
				type : "base",
				orgName : "Taustakartat",
				baseLayerId : 2,
				formats : {},
				isQueryable : false,
				id : "base_2",
				minScale : 9000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				name : "Maastokartta",
				subLayer : [
						{
							dataUrl_uuid : "a6f8ec61-c717-4988-9692-76e766dea937",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=a6f8ec61-c717-4988-9692-76e766dea937",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 50,
							name : "Peruskartta 1:20k",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 1
						},
						{
							dataUrl_uuid : "d47ac165-6abd-4357-a4f9-a6f17e2b0c58",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=d47ac165-6abd-4357-a4f9-a6f17e2b0c58",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 100,
							name : "Maastokartta 1:50k",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 26000
						},
						{
							dataUrl_uuid : "e9861577-efd5-4448-aded-6131f9d14097",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=e9861577-efd5-4448-aded-6131f9d14097",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 101,
							name : "Maastokartta 1:100k",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 55000
						},
						{
							dataUrl_uuid : "a2cd4d67-ee20-47b7-b899-a4d72e72bb2d",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=a2cd4d67-ee20-47b7-b899-a4d72e72bb2d",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 102,
							name : "Maastokartta 1:250k",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 135000
						},
						{
							dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 103,
							name : "Maastokartta 1:500k",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 280000
						},
						{
							dataUrl_uuid : "980fa404-75d3-4afd-b97e-bf1a9e392cd9",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=980fa404-75d3-4afd-b97e-bf1a9e392cd9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 104,
							name : "Yleiskartta 1:1milj",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 560000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 105,
							name : "Yleiskartta 1:2milj",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 1380000
						},
						{
							dataUrl_uuid : "bb491154-4f95-4b47-b0a3-cf9e1a0a78cc",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=bb491154-4f95-4b47-b0a3-cf9e1a0a78cc",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 107,
							name : "Yleiskartta 1:4milj",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 2600000
						},
						{
							dataUrl_uuid : "",
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
							dataUrl : "",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 108,
							name : "Yleiskartta 1:8milj",
							permissions : {
								publish : -1
							},
							opacity : 40,
							inspire : "Maastokartat",
							maxScale : 5100000
						} ],
				inspire : "Taustakartat",
				maxScale : 1
			},
			{
				styles : {},
				type : "base",
				orgName : "Taustakartat",
				baseLayerId : 35,
				formats : {},
				isQueryable : false,
				id : "base_35",
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
				name : "Taustakartta",
				subLayer : [
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 21,
							name : "Taustakartta 1:5000",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 1
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 22,
							name : "Taustakartta 1:10k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 5001
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 23,
							name : "Taustakartta 1:20k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 21000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 24,
							name : "Taustakartta 1:40k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 55000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 25,
							name : "Taustakartta 1:80k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 180000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 26,
							name : "Taustakartta 1:160k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 133000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 27,
							name : "Taustakartta 1:320k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 250000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 28,
							name : "Taustakartta 1:800k",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 351000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 29,
							name : "Taustakartta 1:2milj",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 801000
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 30,
							name : "Taustakartta 1:4milj",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 2000001
						},
						{
							dataUrl_uuid : "c22da116-5095-4878-bb04-dd7db3a1a341",
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
							dataUrl : "/catalogue/ui/metadata.html?uuid=c22da116-5095-4878-bb04-dd7db3a1a341",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 31,
							name : "Taustakartta 1:8milj",
							permissions : {
								publish : -1
							},
							opacity : 100,
							inspire : "Opaskartat",
							maxScale : 4000001
						} ],
				inspire : "Taustakartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "67f4eb88-5503-4fb7-9b62-43bef7b5cf19",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=67f4eb88-5503-4fb7-9b62-43bef7b5cf19",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 150,
				name : "VTJ Rakennusten osoitenumerot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "08f343de-d1e6-4418-af09-9e74249f36d7",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=08f343de-d1e6-4418-af09-9e74249f36d7",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere,http://wms.x.paikkatietoikkuna.fi/wms/tampere,http://wms.y.paikkatietoikkuna.fi/wms/tampere,http://wms.z.paikkatietoikkuna.fi/wms/tampere",
				orderNumber : 500,
				name : "Tampereen opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				orderNumber : 550,
				name : "Tampereen yleiskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere:tampere_vkartta_tm35",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_vkartta_tm35",
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
				dataUrl : "",
				style : "",
				updated : "Fri Feb 17 15:49:32 EET 2012",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				orderNumber : 560,
				name : "Tampereen virastokartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "079e02ff-318d-4b57-9441-838806381128",
				wmsName : "tampere:tampere_meta_tm35",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_meta_tm35",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=079e02ff-318d-4b57-9441-838806381128",
				style : "",
				updated : "Fri Feb 17 16:21:39 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere,http://wms.x.paikkatietoikkuna.fi/wms/tampere,http://wms.y.paikkatietoikkuna.fi/wms/tampere,http://wms.z.paikkatietoikkuna.fi/wms/tampere",
				orderNumber : 570,
				name : "Tampereen kantakartta",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "32160608-74f1-478f-af22-082efe8c20c7",
				wmsName : "tampere:tampere_kaavat_tm35",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_kaavat_tm35",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=32160608-74f1-478f-af22-082efe8c20c7",
				style : "",
				updated : "Fri Feb 17 16:06:46 EET 2012",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				orderNumber : 600,
				name : "Tampereen asemakaava",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere:tampere_tonttijaot_tm35",
				styles : {
					title : "Raster",
					legend : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a/GetLegendGraphic?VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=tampere:tampere_tonttijaot_tm35",
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
				dataUrl : "",
				style : "",
				updated : "Fri Feb 17 16:28:22 EET 2012",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a",
				orderNumber : 640,
				name : "Tampereen tonttijako",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms1.navici.com/wms/5640a3028485ae0e1bcfa19e7af93e0a?SERVICE=WMS&",
				orderNumber : 650,
				name : "Tampereen kaavaindeksi",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=AK_KAAVATYOT_VIEW",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 121,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Thu Jan 12 15:30:03 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 660,
				name : "Tampereen vireillä olevia kaavoja",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "tre_ak_kaavatilanne",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 670,
				name : "Tampereen kaavatilannekartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "00f1cc89-7161-417c-8426-35d7506520de",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=00f1cc89-7161-417c-8426-35d7506520de",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 680,
				name : "Tampereen asemakaavaindeksi",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows?",
				orderNumber : 685,
				name : "Tampereen yleiskaavaindeksi",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 690,
				name : "Tampereen yleiskaavan käyttötarkoitusalueet",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "36a49889-7853-42f2-81f8-be665713f2bb",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=36a49889-7853-42f2-81f8-be665713f2bb",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 700,
				name : "Tampereen rakennuskieltoalueet",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 710,
				name : "Tampereen yleisen alueen indeksi",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 720,
				name : "Tampereen suuralueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 730,
				name : "Tampereen tilastoalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Tilastoyksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=KH_SUUNNITTELUALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 138,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Thu Jan 12 15:57:07 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 740,
				name : "Tampereen suunnittelualueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 750,
				name : "Tampereen äänestysalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 760,
				name : "Tampereen postipiirit",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "0d705500-4b2c-4d0e-87bf-564dd0cd3df5",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=0d705500-4b2c-4d0e-87bf-564dd0cd3df5",
				style : "",
				updated : "Mon Feb 20 11:28:11 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 770,
				name : "Tampereen koulualueet yläaste",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b0cec5d0-0335-43fc-80c1-d4cfb6b135c2",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=b0cec5d0-0335-43fc-80c1-d4cfb6b135c2",
				style : "",
				updated : "Mon Feb 20 11:29:26 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 780,
				name : "Tampereen koulualueet ala-aste",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "5395fa72-b053-4fef-aab0-c7c9ab880c91",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=5395fa72-b053-4fef-aab0-c7c9ab880c91",
				style : "",
				updated : "Mon Feb 20 14:41:41 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 790,
				name : "Tampereen kiintopisteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Koordinaattijärjestelmät",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 800,
				name : "Tampereen rakennukset",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "48a5568b-e16f-4856-9f47-240f91d51ce0",
				wmsName : "tampere_ora:KI_KIINTEISTOT",
				styles : [
						{
							title : "Default polygon style",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_KIINTEISTOT&style=polygon",
							name : "polygon"
						},
						{
							title : "Asemakaavaindeksin tyyli",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_KIINTEISTOT",
							name : "tre_kiinteistorajat"
						} ],
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=KI_KIINTEISTOT",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 214,
				minScale : 80000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=48a5568b-e16f-4856-9f47-240f91d51ce0",
				style : "tre_kiinteistorajat",
				updated : "Mon Feb 20 11:24:55 EET 2012",
				created : "Thu Jan 12 12:23:54 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 810,
				name : "Tampereen kiinteistöt",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "48a5568b-e16f-4856-9f47-240f91d51ce0",
				wmsName : "tampereen_kiinteistöt_wfs",
				styles : {},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 218,
				minScale : 8000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=48a5568b-e16f-4856-9f47-240f91d51ce0",
				style : '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">\r\n\t<NamedLayer>\r\n\t\t<Name>WFSTampere</Name>\r\n\t\t<UserStyle>\r\n\t\t\t<Title>Default WFS Tampere style</Title>\r\n\t\t\t<Abstract/>\r\n\t\t\t<FeatureTypeStyle>\r\n\t\t\t\t<Rule>\r\n\t\t\t\t\t<Title>Kiinteistö</Title>\r\n\t\t\t\t\t<PolygonSymbolizer>\r\n\t\t\t\t\t\t<Fill>\r\n\t\t\t\t\t\t\t<CssParameter name="fill">#E0AFAF</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="fill-opacity">0.2</CssParameter>\r\n\t\t\t\t\t\t</Fill>\r\n\t\t\t\t\t\t<Stroke>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke">#FF0000</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke-width">1</CssParameter>\r\n\t\t\t\t\t\t</Stroke>\r\n\t\t\t\t\t</PolygonSymbolizer>\r\n\t\t\t\t</Rule>\r\n\t\t\t</FeatureTypeStyle>\r\n\t\t</UserStyle>\r\n\t</NamedLayer>\r\n</StyledLayerDescriptor>',
				updated : "Mon Feb 20 11:25:07 EET 2012",
				created : "Wed Jan 18 16:01:41 EET 2012",
				wmsUrl : "wfs",
				orderNumber : 820,
				name : "Tampereen kaupungin kiinteistöt",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:KI_TRE_OMISTUS_VIEW",
				styles : {
					title : "Kaavatilannekartan tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=KI_TRE_OMISTUS_VIEW",
					name : "tre_omistus"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=KI_TRE_OMISTUS_VIEW",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 219,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 15:38:45 EET 2012",
				created : "Mon Feb 20 11:24:39 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 830,
				name : "Tampereen kaupungin omistamat kiinteistöt",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_iris:WFS_LUPA_VOIMASSA",
				styles : {
					title : "Default point",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=WFS_LUPA_VOIMASSA",
					name : "point"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=WFS_LUPA_VOIMASSA",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 220,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 12:37:49 EET 2012",
				created : "Mon Feb 20 12:34:41 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 840,
				name : "Tampereen voimassa olevat katuluvat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_LUONNONMUISTOMERKKI",
				styles : {
					title : "Default point",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_LUONNONMUISTOMERKKI",
					name : "point"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_LUONNONMUISTOMERKKI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 221,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 13:30:25 EET 2012",
				created : "Mon Feb 20 13:30:25 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 850,
				name : "Tampereen luonnonmuistomerkit",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_PIENVEDET",
				styles : {
					title : "1 px blue line",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_PIENVEDET",
					name : "tre_pienvedet"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_PIENVEDET",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 222,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 13:35:37 EET 2012",
				created : "Mon Feb 20 13:35:37 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 860,
				name : "Tampereen pienvedet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_ARSEENIRISKIALUE",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_ARSEENIRISKIALUE",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_ARSEENIRISKIALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 223,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 13:44:03 EET 2012",
				created : "Mon Feb 20 13:42:05 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 870,
				name : "Tampereen arseeniriskialueet",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_FLUORIDIRISKIALUE",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_FLUORIDIRISKIALUE",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_FLUORIDIRISKIALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 224,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 14:10:21 EET 2012",
				created : "Mon Feb 20 13:45:51 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 880,
				name : "Tampereen fluoridiriskialueet",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_ILMANLAATU_2000",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_ILMANLAATU_2000",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_ILMANLAATU_2000",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 225,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 13:55:31 EET 2012",
				created : "Mon Feb 20 13:52:13 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 890,
				name : "Tampereen ilmanlaatu 2000",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_ILMANLAATU_2020",
				styles : [
						{
							title : "Default polygon style",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_ILMANLAATU_2020&style=polygon",
							name : "polygon"
						},
						{
							title : "Ilmanlaatu 2020",
							legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_ILMANLAATU_2020",
							name : "tre_ilmanlaatu_2020"
						} ],
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_ILMANLAATU_2020",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 226,
				minScale : 80000,
				dataUrl : "",
				style : "tre_ilmanlaatu_2020",
				updated : "Mon Feb 20 13:55:03 EET 2012",
				created : "Mon Feb 20 13:53:30 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 900,
				name : "Tampereen ilmanlaatu 2020",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_JARVI",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_JARVI",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_JARVI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 227,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 13:57:57 EET 2012",
				created : "Mon Feb 20 13:57:57 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 910,
				name : "Tampereen järvien vedenlaatu",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:LU_VANHAT_METSAT_2006",
				styles : {
					title : "Green polygon",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=LU_VANHAT_METSAT_2006",
					name : "green"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=LU_VANHAT_METSAT_2006",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 228,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 14:01:31 EET 2012",
				created : "Mon Feb 20 14:01:31 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 920,
				name : "Tampereen vanhat metsät",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_SAAST_MAA_ALUE",
				styles : {
					title : "Default polygon style",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_SAAST_MAA_ALUE",
					name : "polygon"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_SAAST_MAA_ALUE",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 229,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 14:04:31 EET 2012",
				created : "Mon Feb 20 14:04:31 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 920,
				name : "Tampereen vanhat kaatopaikat",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_YMPARISTONSUOJELU",
				styles : {
					title : "Default point",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_YMPARISTONSUOJELU",
					name : "point"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_YMPARISTONSUOJELU",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 230,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Feb 20 14:08:49 EET 2012",
				created : "Mon Feb 20 14:06:56 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 930,
				name : "Tampereen ympäristönsuojelun valvontakohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_MELU_P_2012_KESKIAANI",
				styles : {
					title : "Kaavatilannekartan tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_MELU_P_2012_KESKIAANI",
					name : "tre_melu"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_MELU_P_2012_KESKIAANI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 234,
				minScale : 80000,
				dataUrl : "",
				style : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				updated : "Fri Feb 24 13:07:28 EET 2012",
				created : "Fri Feb 24 12:50:30 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 940,
				name : "Tampereen melu päivä 2012 keskiäänitaso",
				permissions : {
					publish : -1
				},
				opacity : 65,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_MELU_Y_2012_KESKIAANI",
				styles : {
					title : "Kaavatilannekartan tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_MELU_Y_2012_KESKIAANI",
					name : "tre_melu"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_MELU_Y_2012_KESKIAANI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 235,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Fri Feb 24 13:07:40 EET 2012",
				created : "Fri Feb 24 12:52:47 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 950,
				name : "Tampereen melu yö 2012 keskiäänitaso",
				permissions : {
					publish : -1
				},
				opacity : 65,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_MELU_P_2030_KESKIAANI",
				styles : {
					title : "Kaavatilannekartan tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_MELU_P_2030_KESKIAANI",
					name : "tre_melu"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_MELU_P_2030_KESKIAANI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 236,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Fri Feb 24 13:07:50 EET 2012",
				created : "Fri Feb 24 12:54:29 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 960,
				name : "Tampereen melu päivä 2030 keskiäänitaso",
				permissions : {
					publish : -1
				},
				opacity : 65,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "tampere_ora:YV_MELU_Y_2030_KESKIAANI",
				styles : {
					title : "Kaavatilannekartan tyyli",
					legend : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=YV_MELU_Y_2030_KESKIAANI",
					name : "tre_melu"
				},
				descriptionLink : "",
				baseLayerId : 23,
				orgName : "Tampereen kaupunki",
				type : "wmslayer",
				legendImage : "http://tampere.navici.com:80/tampere_wfs_geoserver/wms?request=GetLegendGraphic&amp;format=image%2Fpng&amp;width=20&amp;height=20&amp;layer=YV_MELU_Y_2030_KESKIAANI",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 237,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Fri Feb 24 13:07:59 EET 2012",
				created : "Fri Feb 24 12:57:29 EET 2012",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/tampere_wfs_geoserver/ows",
				orderNumber : 970,
				name : "Tampereen melu yö 2030 keskiäänitaso",
				permissions : {
					publish : -1
				},
				opacity : 65,
				inspire : "Ympäristön tilan seurantalaitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "e5265f1a-48f2-4353-970e-aab2cf57a98f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 104,
				name : "Muinaisjäännökset",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "e5265f1a-48f2-4353-970e-aab2cf57a98f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 105,
				name : "Muinaisjäännösten alakohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "e5265f1a-48f2-4353-970e-aab2cf57a98f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e5265f1a-48f2-4353-970e-aab2cf57a98f",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 106,
				name : "Muinaisjäännösalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "2aacd6b1-af40-4897-aedb-85dad3facdf4",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=2aacd6b1-af40-4897-aedb-85dad3facdf4",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 107,
				name : "Rakennusperintö",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "2aacd6b1-af40-4897-aedb-85dad3facdf4",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=2aacd6b1-af40-4897-aedb-85dad3facdf4",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 108,
				name : "Rakennusperintökohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c5bc6715-c823-4861-9491-620034cf12bd",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 109,
				name : "RKY - pistemäiset kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c5bc6715-c823-4861-9491-620034cf12bd",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 110,
				name : "RKY - viivamaiset kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c5bc6715-c823-4861-9491-620034cf12bd",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c5bc6715-c823-4861-9491-620034cf12bd",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 111,
				name : "RKY - aluemaiset kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 112,
				name : "Maailmanperintökohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.nba.fi/arcgis/services/WMS/MVWMS/MapServer/WMSServer",
				orderNumber : 113,
				name : "Maailmanperintöalueet",
				permissions : {
					publish : 2
				},
				opacity : 80,
				inspire : "Suojellut alueet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 1,
				name : "Turvekartoitus",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Energiavarat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "0f3f054f-ad70-4cf1-a1d1-93589261bd04",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=0f3f054f-ad70-4cf1-a1d1-93589261bd04",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 2,
				name : "Maaperäkartta 1:20 000 / 1:50 000",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Geologia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "ade1283b-0e69-4166-a52a-261d04f32cd0",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=ade1283b-0e69-4166-a52a-261d04f32cd0",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 3,
				name : "Digitaalinen maaperäkartta 1:200 000",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 100000
			},
			{
				dataUrl_uuid : "98dd3816-e223-4864-848b-f463796d0c29",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=98dd3816-e223-4864-848b-f463796d0c29",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 4,
				name : "Suomen maaperä 1:1 000 000",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Geologia",
				maxScale : 500000
			},
			{
				dataUrl_uuid : "",
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
				minScale : 250000,
				dataUrl : "",
				style : '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">\r\n\t<NamedLayer>\r\n\t\t<Name>Kallioperätiedot</Name>\r\n\t\t<UserStyle>\r\n\t\t\t<Title>GTK Kallioperätiedot</Title>\r\n\t\t\t<Abstract/>\r\n\t\t\t<FeatureTypeStyle>\r\n\t\t\t\t<Rule>\r\n\t\t\t\t\t<Title>Line</Title>\r\n\t\t\t\t\t<PolygonSymbolizer>\r\n\t\t\t\t\t\t<Fill>\r\n\t\t\t\t\t\t\t<CssParameter name="fill">#734F1B</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="fill-opacity">0.5</CssParameter>\r\n\t\t\t\t\t\t</Fill>\r\n\t\t\t\t\t\t<Stroke>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke">#000000</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke-width">2</CssParameter>\r\n\t\t\t\t\t\t</Stroke>\r\n\t\t\t\t\t</PolygonSymbolizer>\r\n\t\t\t\t</Rule>\r\n\t\t\t</FeatureTypeStyle>\r\n\t\t</UserStyle>\r\n\t</NamedLayer>\r\n</StyledLayerDescriptor>',
				updated : "Tue Jan 31 17:20:14 EET 2012",
				wmsUrl : "wfs",
				orderNumber : 5,
				name : "Suomen maaperä 1:1 000 000 (WFS)",
				permissions : {
					publish : -1
				},
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "f4dde0c8-05d2-4f7b-99ed-b70f8aabe6e2",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=f4dde0c8-05d2-4f7b-99ed-b70f8aabe6e2",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 6,
				name : "Aeromagneettiset matalalentomittaukset",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "8cf3b45c-85a7-471e-ac14-80dbc849c71e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=8cf3b45c-85a7-471e-ac14-80dbc849c71e",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 8,
				name : "Suomen pintageologiakartta 1:1 000 000",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 250000
			},
			{
				dataUrl_uuid : "",
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
				minScale : 250000,
				dataUrl : "",
				style : '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">\r\n\t<NamedLayer>\r\n\t\t<Name>Kallioperätiedot</Name>\r\n\t\t<UserStyle>\r\n\t\t\t<Title>GTK Kallioperätiedot</Title>\r\n\t\t\t<Abstract/>\r\n\t\t\t<FeatureTypeStyle>\r\n\t\t\t\t<Rule>\r\n\t\t\t\t\t<Title>Line</Title>\r\n\t\t\t\t\t<PolygonSymbolizer>\r\n\t\t\t\t\t\t<Fill>\r\n\t\t\t\t\t\t\t<CssParameter name="fill">#DBC09A</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="fill-opacity">0.5</CssParameter>\r\n\t\t\t\t\t\t</Fill>\r\n\t\t\t\t\t\t<Stroke>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke">#000000</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke-width">2</CssParameter>\r\n\t\t\t\t\t\t</Stroke>\r\n\t\t\t\t\t</PolygonSymbolizer>\r\n\t\t\t\t</Rule>\r\n\t\t\t</FeatureTypeStyle>\r\n\t\t</UserStyle>\r\n\t</NamedLayer>\r\n</StyledLayerDescriptor>',
				updated : "Tue Jan 31 17:20:58 EET 2012",
				wmsUrl : "wfs",
				orderNumber : 9,
				name : "Suomen pintageologiakartta 1:1 000 000 (WFS)",
				permissions : {
					publish : -1
				},
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "f88b26f6-faea-4911-aaf4-40b1e25b37a0",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=f88b26f6-faea-4911-aaf4-40b1e25b37a0",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 10,
				name : "Digitaalinen kallioperäkartta 1:200 000",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 20000
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 11,
				name : "Kallioperäkartta 1:100 000",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "75839cb0-713d-418c-92d0-44bf216aa572",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=75839cb0-713d-418c-92d0-44bf216aa572",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 12,
				name : "Suomen kallioperä 1:1 000 000",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Geologia",
				maxScale : 250000
			},
			{
				dataUrl_uuid : "",
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
				minScale : 250000,
				dataUrl : "",
				style : '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">\r\n\t<NamedLayer>\r\n\t\t<Name>Kallioperätiedot</Name>\r\n\t\t<UserStyle>\r\n\t\t\t<Title>GTK Kallioperätiedot</Title>\r\n\t\t\t<Abstract/>\r\n\t\t\t<FeatureTypeStyle>\r\n\t\t\t\t<Rule>\r\n\t\t\t\t\t<Title>Line</Title>\r\n\t\t\t\t\t<PolygonSymbolizer>\r\n\t\t\t\t\t\t<Fill>\r\n\t\t\t\t\t\t\t<CssParameter name="fill">#C0C0C0</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="fill-opacity">0.5</CssParameter>\r\n\t\t\t\t\t\t</Fill>\r\n\t\t\t\t\t\t<Stroke>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke">#000000</CssParameter>\r\n\t\t\t\t\t\t\t<CssParameter name="stroke-width">2</CssParameter>\r\n\t\t\t\t\t\t</Stroke>\r\n\t\t\t\t\t</PolygonSymbolizer>\r\n\t\t\t\t</Rule>\r\n\t\t\t</FeatureTypeStyle>\r\n\t\t</UserStyle>\r\n\t</NamedLayer>\r\n</StyledLayerDescriptor>',
				updated : "Tue Jan 31 17:21:36 EET 2012",
				wmsUrl : "wfs",
				orderNumber : 13,
				name : "Suomen kallioperä 1:1 000 000 (WFS)",
				permissions : {
					publish : -1
				},
				opacity : 50,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "9f660137-4f2a-48f0-8024-f8817ca6e75e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f660137-4f2a-48f0-8024-f8817ca6e75e",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 14,
				name : "Suomen kallioperän ikämääritykset",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "588fbcfc-f7d1-4668-ab4c-c14d4796dfa6",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=588fbcfc-f7d1-4668-ab4c-c14d4796dfa6",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 15,
				name : "Kallioperä- ja lohkarehavaintoaineisto",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "db8a66fa-e319-4c50-92e8-924db7693838",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=db8a66fa-e319-4c50-92e8-924db7693838",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 16,
				name : "Suomen kalliogeokemian tietokanta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "3cb8f375-202c-4671-bffb-51f9a64d8aca",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=3cb8f375-202c-4671-bffb-51f9a64d8aca",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 17,
				name : "Suuralueellinen moreenigeokemiallinen kartoitus",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "463f5375-0fae-4dc5-af90-a8ebbf87035a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=463f5375-0fae-4dc5-af90-a8ebbf87035a",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 18,
				name : "Suuralueellinen purosedimenttigeokemiallinen kartoitus",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "403968d6-af88-47b5-940b-f6278482378e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=403968d6-af88-47b5-940b-f6278482378e",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/GTKWMS/MapServer/WMSServer",
				orderNumber : 19,
				name : "Suuralueellinen purovesigeokemiallinen kartoitus",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "34155a94-b58b-4ad0-87e6-f96d2db0f3ba",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=34155a94-b58b-4ad0-87e6-f96d2db0f3ba",
				style : "",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				orderNumber : 300,
				name : "Digiroad",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "41b95d0a-99cd-4cb7-be57-33723938249c",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=41b95d0a-99cd-4cb7-be57-33723938249c",
				style : "",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				orderNumber : 350,
				name : "Rataverkko",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "2d61d8a4-6a5b-49d0-9e3d-279a3071864c",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=2d61d8a4-6a5b-49d0-9e3d-279a3071864c",
				style : "",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				orderNumber : 351,
				name : "Tasoristeykset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "91bdc4b3-72db-46d6-b542-a1e6d3f68095",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=91bdc4b3-72db-46d6-b542-a1e6d3f68095",
				style : "",
				wmsUrl : "http://kartta.liikennevirasto.fi/maaliikenne/wms",
				orderNumber : 355,
				name : "Tieosoiteverkko",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
				wmsName : "cells",
				styles : [
						{
							title : "Standard",
							legend : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-200&FORMAT=image/png&WIDTH=200&HEIGHT=402",
							name : "style-id-200"
						},
						{
							title : "Standard - Transparent Land",
							legend : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-201&FORMAT=image/png&WIDTH=200&HEIGHT=402",
							name : "style-id-201"
						},
						{
							title : "Full",
							legend : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-202&FORMAT=image/png&WIDTH=200&HEIGHT=402",
							name : "style-id-202"
						},
						{
							title : "Full - Transparent Land",
							legend : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-203&FORMAT=image/png&WIDTH=200&HEIGHT=402",
							name : "style-id-203"
						} ],
				descriptionLink : "",
				baseLayerId : 10,
				orgName : "Liikennevirasto",
				type : "wmslayer",
				legendImage : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=cells&STYLE=style-id-203&FORMAT=image/png&WIDTH=200&HEIGHT=402",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 27,
				minScale : 2000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
				style : "style-id-201",
				updated : "Tue Feb 21 15:53:57 EET 2012",
				wmsUrl : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta",
				orderNumber : 400,
				name : "Elektroniset merikartat (ENC)",
				permissions : {
					publish : -1
				},
				opacity : 75,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
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
				descriptionLink : "",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=1d1c8600-76bf-4e1f-bd09-b5c154ca30dc",
				style : "",
				updated : "Tue Feb 21 15:52:36 EET 2012",
				wmsUrl : "http://kartta.liikennevirasto.fi/meriliikenne/dgds/wms_ip/merikartta",
				orderNumber : 401,
				name : "ENC-kattavuusalueet",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "4e335194-7b87-45c5-ad4f-792baaf90433",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=4e335194-7b87-45c5-ad4f-792baaf90433",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/MaviPaikkatietoikkuna?",
				orderNumber : 750,
				name : "Peltolohkorekisteri 2010",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "7d0b6514-d7f4-41b2-81c4-1f9f13aa8180",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=7d0b6514-d7f4-41b2-81c4-1f9f13aa8180",
				style : "",
				wmsUrl : "wfs",
				orderNumber : 1,
				name : "Nimistön kyselypalvelu",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Paikannimet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
				orderNumber : 8,
				name : "Ortoilmakuva",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=b20a360b-1734-41e5-a5b8-0e90dd9f2af3",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
				orderNumber : 9,
				name : "Väärävärikuva",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "eec8a276-a406-4b0a-8896-741cd716ade6",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=eec8a276-a406-4b0a-8896-741cd716ade6",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 45,
				name : "Paikannimet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Paikannimet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c1890eb1-e25e-4652-9596-ce72f6d7fcf0",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1890eb1-e25e-4652-9596-ce72f6d7fcf0",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 50,
				name : "Tienimet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "myrskytuho",
				descriptionLink : "",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 215,
				minScale : 80000,
				dataUrl : "",
				style : "",
				updated : "Mon Jan 23 13:21:42 EET 2012",
				created : "Tue Jan 17 15:07:33 EET 2012",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot?",
				orderNumber : 59,
				name : "Myrskytuhokuvat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 305,
				name : "Liikenneverkko",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1000,
				name : "Vesi",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1001,
				name : "Korkeuskäyrät",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1002,
				name : "Hallintorajat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1003,
				name : "Rakennukset",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1005,
				name : "Kalliot ja hietikot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1006,
				name : "Pellot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1007,
				name : "Avoimet metsämaat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1008,
				name : "Suot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 1
			},
			{
				dataUrl_uuid : "cfe54093-aa87-46e2-bfa2-a20def7b036f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfe54093-aa87-46e2-bfa2-a20def7b036f",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1009,
				name : "Pohjakuviot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Taustakartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1010,
				name : "Karttalehtijaot",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1012,
				name : "MML toimipisteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1013,
				name : "MML toimialueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "ows:UTM-lehtijako 1_25000",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_25000",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 63,
				minScale : 10000000,
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1501,
				name : "TM35-lehtijako 1:25000",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "ows:UTM-lehtijako 1_50000",
				descriptionLink : "http://www.paikkatietoikkuna.fi/web/guest/maastotietokanta",
				orgName : "Maanmittauslaitos",
				type : "wmslayer",
				baseLayerId : 15,
				legendImage : "http://www.paikkatietoikkuna.fi:80/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=UTM-lehtijako+1_50000",
				formats : {
					value : "text/html"
				},
				isQueryable : false,
				id : 62,
				minScale : 10000000,
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 1502,
				name : "TM35-lehtijako 1:50000",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Paikannusruudustot",
				maxScale : 1
			},
			{
				styles : {},
				orgName : "Maanmittauslaitos",
				type : "groupMap",
				baseLayerId : 36,
				formats : {},
				isQueryable : false,
				id : "base_36",
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
				name : "Kuntajako",
				subLayer : [
						{
							dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
							wmsName : "kuntarajat_10k",
							descriptionLink : "",
							orgName : "Kuntajako",
							type : "wmslayer",
							baseLayerId : 36,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 195,
							minScale : 15000,
							dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 61,
							name : "Kuntajako 1:10 000",
							permissions : {
								publish : 2
							},
							opacity : 100,
							inspire : "Hallinnolliset yksiköt",
							maxScale : 1
						},
						{
							dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
							wmsName : "kuntarajat_100k",
							descriptionLink : "",
							orgName : "Kuntajako",
							type : "wmslayer",
							baseLayerId : 36,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 196,
							minScale : 80000,
							dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 62,
							name : "Kuntajako 1:100 000",
							permissions : {
								publish : 2
							},
							opacity : 100,
							inspire : "Hallinnolliset yksiköt",
							maxScale : 15001
						},
						{
							dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
							wmsName : "kuntarajat_250k",
							descriptionLink : "",
							orgName : "Kuntajako",
							type : "wmslayer",
							baseLayerId : 36,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 197,
							minScale : 230000,
							dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 63,
							name : "Kuntajako 1:250 000",
							permissions : {
								publish : 2
							},
							opacity : 100,
							inspire : "Hallinnolliset yksiköt",
							maxScale : 80000
						},
						{
							dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
							wmsName : "kuntarajat_1000k",
							descriptionLink : "",
							orgName : "Kuntajako",
							type : "wmslayer",
							baseLayerId : 36,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 198,
							minScale : 800000,
							dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 64,
							name : "Kuntajako 1:1milj",
							permissions : {
								publish : 2
							},
							opacity : 100,
							inspire : "Hallinnolliset yksiköt",
							maxScale : 231000
						},
						{
							dataUrl_uuid : "da40f862-44b5-47b9-aea8-83bb1e640ca9",
							wmsName : "kuntarajat_4500k",
							descriptionLink : "",
							orgName : "Kuntajako",
							type : "wmslayer",
							baseLayerId : 36,
							legendImage : "",
							formats : {
								value : "text/html"
							},
							isQueryable : false,
							id : 199,
							minScale : 15000000,
							dataUrl : "/catalogue/ui/metadata.html?uuid=da40f862-44b5-47b9-aea8-83bb1e640ca9",
							style : "",
							wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriaineistot/service/wms",
							orderNumber : 65,
							name : "Kuntajako 1:4,5milj",
							permissions : {
								publish : 2
							},
							opacity : 100,
							inspire : "Hallinnolliset yksiköt",
							maxScale : 850000
						} ],
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "76b8f23c-5df2-43ba-9c39-fe0e2b41242e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=76b8f23c-5df2-43ba-9c39-fe0e2b41242e",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				orderNumber : 101,
				name : "Luonnonsuojelu- ja erämaa-alueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "eea8c157-33e3-4f71-b5db-7939222a790a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=eea8c157-33e3-4f71-b5db-7939222a790a",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				orderNumber : 103,
				name : "Natura2000 viivamaiset kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "eea8c157-33e3-4f71-b5db-7939222a790a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=eea8c157-33e3-4f71-b5db-7939222a790a",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_SuojellutAlueet/MapServer/WMSServer?",
				orderNumber : 104,
				name : "Natura2000 aluemaiset kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Suojellut alueet",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "e907f731-7244-4549-a83f-5a73e7de1071",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e907f731-7244-4549-a83f-5a73e7de1071",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 105,
				name : "Päävesistöalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "e907f731-7244-4549-a83f-5a73e7de1071",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e907f731-7244-4549-a83f-5a73e7de1071",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 106,
				name : "Valuma-alueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "de91c708-7a67-4492-b0f6-76ab1c55a57f",
				wmsName : "Network.WatercourseLink",
				styles : {
					title : "Network.WatercourseLink",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Network.WatercourseLink",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Network.WatercourseLink",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 200,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=de91c708-7a67-4492-b0f6-76ab1c55a57f",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 107,
				name : "Uomaverkosto",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 15000
			},
			{
				dataUrl_uuid : "de91c708-7a67-4492-b0f6-76ab1c55a57f",
				wmsName : "Network.HydroNode",
				styles : {
					title : "Network.HydroNode",
					legend : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Network.HydroNode",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=Network.HydroNode",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 201,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=de91c708-7a67-4492-b0f6-76ab1c55a57f",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 108,
				name : "Solmupiste",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 15000
			},
			{
				dataUrl_uuid : "cfc5795e-e56d-43e6-a36c-09db72c5146a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 108,
				name : "VPD Joki",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "cfc5795e-e56d-43e6-a36c-09db72c5146a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 108,
				name : "VPD Järvi",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "cfc5795e-e56d-43e6-a36c-09db72c5146a",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=cfc5795e-e56d-43e6-a36c-09db72c5146a",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Hydrografia/MapServer/WMSServer?",
				orderNumber : 110,
				name : "VPD Rannikkovesi",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hydrografia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				orderNumber : 111,
				name : "Järvien syvyyspisteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				orderNumber : 112,
				name : "Järvien syvyyskäyrät",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=d217d4e3-183f-40a0-b1eb-8d58cf53fceb",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Korkeus/MapServer/WMSServer",
				orderNumber : 113,
				name : "Järvien syvyysalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer",
				orderNumber : 141,
				name : "Pohjavesialuerajat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 1
			},
			{
				dataUrl_uuid : "9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=9f13a9c0-7cea-4398-a401-35dbc24bfe4f",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGis/services/INSPIRE/SYKE_Geologia/MapServer/WMSServer",
				orderNumber : 142,
				name : "Pohjavesialueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Geologia",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "d38853db-61df-481f-a60b-060fca484111",
				wmsName : "CorineLandCover2000_25m",
				styles : {
					title : "CorineLandCover2000_25m",
					legend : "http://paikkatieto.ymparisto.fi/ArcGIS/wms/clc2000_25m_legenda.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGIS/wms/clc2000_25m_legenda.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 168,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=d38853db-61df-481f-a60b-060fca484111",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				orderNumber : 150,
				name : "Corine Land Cover 2000, 25 m",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "d38853db-61df-481f-a60b-060fca484111",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=d38853db-61df-481f-a60b-060fca484111",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				orderNumber : 151,
				name : "Corine Land Cover 2000, 25 ha",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "e3deb283-d66b-4876-83f4-9d5014745725",
				wmsName : "CorineLandCover2006_25m",
				styles : {
					title : "CorineLandCover2006_25m",
					legend : "http://paikkatieto.ymparisto.fi/ArcGIS/wms/clc2006_25m_legenda.png",
					name : "default"
				},
				descriptionLink : "",
				baseLayerId : 25,
				orgName : "Suomen ympäristökeskus",
				type : "wmslayer",
				legendImage : "http://paikkatieto.ymparisto.fi/ArcGIS/wms/clc2006_25m_legenda.png",
				formats : {
					value : "text/html"
				},
				isQueryable : true,
				id : 170,
				minScale : 15000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=e3deb283-d66b-4876-83f4-9d5014745725",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				orderNumber : 152,
				name : "Corine Land Cover 2006, 25 m",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "e3deb283-d66b-4876-83f4-9d5014745725",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=e3deb283-d66b-4876-83f4-9d5014745725",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Maanpeite/MapServer/WMSServer",
				orderNumber : 153,
				name : "Corine Land Cover 2006, 25 ha",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maanpeite",
				maxScale : 10000
			},
			{
				dataUrl_uuid : "3c80ee05-8597-4e80-a5a1-bd9e1db771be",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=3c80ee05-8597-4e80-a5a1-bd9e1db771be",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer",
				orderNumber : 160,
				name : "Image 2000 mosaiikki",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b18f6b82-357c-4297-9c70-013fda41370e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=b18f6b82-357c-4297-9c70-013fda41370e",
				style : "",
				wmsUrl : "http://paikkatieto.ymparisto.fi/ArcGIS/services/INSPIRE/SYKE_Ortoilmakuvat/MapServer/WMSServer",
				orderNumber : 161,
				name : "Image 2006 mosaiikki",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo",
				orderNumber : 1100,
				name : "Rinnevalovarjostus",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://217.152.180.24/cgi-bin/wms_rinnevalo",
				orderNumber : 1101,
				name : "Rinnevalovarjostus (värillinen)",
				permissions : {
					publish : 2
				},
				opacity : 50,
				inspire : "Korkeus",
				maxScale : 1
			},
			{
				dataUrl_uuid : "79accb35-b7e9-4356-bfd2-c4b453e34ed8",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=79accb35-b7e9-4356-bfd2-c4b453e34ed8",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 700,
				name : "SLICES",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "472b3e52-5ba8-4967-8785-4fa13955b42e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=472b3e52-5ba8-4967-8785-4fa13955b42e",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 800,
				name : "Kiinteistöjaotus (päivitetään kerran kuussa)",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "472b3e52-5ba8-4967-8785-4fa13955b42e",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=472b3e52-5ba8-4967-8785-4fa13955b42e",
				style : "",
				wmsUrl : "http://wms.a.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.b.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.c.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms,http://wms.d.paikkatietoikkuna.fi/gwc/mml-rasteriteemat/service/wms",
				orderNumber : 801,
				name : "Kiinteistötunnukset",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Kiinteistöt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1200,
				name : "V-S vahvistetut maakuntakaavat",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1201,
				name : "V-S maakuntakaavan alueidenkäyttö",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1202,
				name : "V-S maakuntakaavan osa-alueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1203,
				name : "V-S maakuntakaavan liikenne",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1204,
				name : "V-S maakuntakaavan reitit ja väylät",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1205,
				name : "V-S maakuntakaavan johtoverkko",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1206,
				name : "V-S maakuntakaavan kehittämisperiaatteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartat.lounaispaikka.fi/wms/maakuntakaava?",
				orderNumber : 1210,
				name : "V-S maakuntakaavan kohteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				orderNumber : 310,
				name : "OpenStreetMap 09/2011",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				orderNumber : 320,
				name : "OpenStreetMap rakennukset 09/2011",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Rakennukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/ilmakuva.mmm.fi/cgi-bin/TikePaikkatietoikkuna?",
				orderNumber : 1300,
				name : "Landsat-kuva",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "34524f11-c11c-482d-a83e-48895572cc76",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=34524f11-c11c-482d-a83e-48895572cc76",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				orderNumber : 600,
				name : "Espoon opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Opaskartat",
				maxScale : 4000
			},
			{
				dataUrl_uuid : "2f642310-df2d-4334-b2e4-a8ad747f96dd",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=2f642310-df2d-4334-b2e4-a8ad747f96dd",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				orderNumber : 601,
				name : "Espoon osoitekartta",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "4a66aebd-9b47-4fe1-a9b1-3f34b43229d0",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=4a66aebd-9b47-4fe1-a9b1-3f34b43229d0",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/kartat.espoo.fi/TeklaOgcWeb/WMS.ashx?",
				orderNumber : 950,
				name : "Espoon maankäyttökartta",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "9ab8a5a8-e869-4568-85a2-2f9eae4acadd",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=9ab8a5a8-e869-4568-85a2-2f9eae4acadd",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 590,
				name : "Jyväskylän asemakaavakartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1600,
				name : "Jyväskylän maastokartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1601,
				name : "Jyväskylän ilmakuva",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "89c6a379-776f-4529-b79d-a456177fb64d",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=89c6a379-776f-4529-b79d-a456177fb64d",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1602,
				name : "Jyväskylän opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1603,
				name : "Jyväskylän äänestysalueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1604,
				name : "Jyväskylän postialueet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1605,
				name : "Jyväskylän kaupunginosat",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Hallinnolliset yksiköt",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1607,
				name : "Jyväskylän ulkoilukartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				wmsUrl : "http://kartta.jkl.fi/TeklaOgcWeb/WMS.ashx",
				orderNumber : 1608,
				name : "Jyväskylän linja-autoreitit",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Liikenneverkot",
				maxScale : 1
			},
			{
				dataUrl_uuid : "7eef345a-b263-43c4-a200-ccb78c0fcedd",
				wmsName : "Opaskartta",
				descriptionLink : "",
				orgName : "Turun kaupunki",
				type : "wmslayer",
				baseLayerId : 19,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 205,
				minScale : 1000000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=7eef345a-b263-43c4-a200-ccb78c0fcedd",
				style : "",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx?",
				orderNumber : 1090,
				name : "Turun seudun opaskartta",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "0ca7b7cd-8b10-466d-baeb-626263a5a204",
				wmsName : "Ilmakuva",
				descriptionLink : "",
				orgName : "Turun kaupunki",
				type : "wmslayer",
				baseLayerId : 19,
				legendImage : "",
				formats : {
					value : ""
				},
				isQueryable : false,
				id : 206,
				minScale : 500000,
				dataUrl : "/catalogue/ui/metadata.html?uuid=0ca7b7cd-8b10-466d-baeb-626263a5a204",
				style : "",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx?",
				orderNumber : 1095,
				name : "Turun seudun ilmakuva",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c1e92bf3-758a-4fc1-87e1-dca692304379",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1e92bf3-758a-4fc1-87e1-dca692304379",
				style : "",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",
				orderNumber : 1100,
				name : "Turun asemakaavayhdelmä",
				permissions : {
					publish : 2
				},
				opacity : 75,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "c1e92bf3-758a-4fc1-87e1-dca692304379",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=c1e92bf3-758a-4fc1-87e1-dca692304379",
				style : "",
				wmsUrl : "http://opaskartta.turku.fi/TeklaOgcWeb/wms.ashx",
				orderNumber : 1101,
				name : "Turun asemakaavan pohjakartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Maankäyttö",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
				wmsName : "palvelupisteiden_kyselypalvelu",
				styles : {},
				descriptionLink : "",
				baseLayerId : 27,
				orgName : "Valtiokonttori",
				type : "wfslayer",
				legendImage : "",
				formats : {},
				isQueryable : false,
				id : 216,
				minScale : 50000,
				dataUrl : "",
				style : '<?xml version="1.0" encoding="ISO-8859-1"?>\r\n<StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">\r\n\t<NamedLayer>\r\n\t\t<Name>Palvelupisteet</Name>\r\n\t\t<UserStyle>\r\n\t\t\t<Title>Palvelupisteiden tyyli</Title>\r\n\t\t\t<Abstract/>\r\n\t\t\t<FeatureTypeStyle>\r\n\t\t\t\t<Rule>\r\n\t\t\t\t\t<Title>Piste</Title>\r\n\t\t\t\t\t<PointSymbolizer>\r\n\t\t\t\t\t\t<Graphic>\r\n\t\t\t\t\t\t\t<Mark>\r\n\t\t\t\t\t\t\t\t<WellKnownName>circle</WellKnownName>\r\n\t\t\t\t\t\t\t\t<Fill>\r\n\t\t\t\t\t\t\t\t\t<CssParameter name="fill">#FFFFFF</CssParameter>\r\n\t\t\t\t\t\t\t\t</Fill>\r\n\t\t\t\t\t\t\t\t<Stroke>\r\n\t\t\t\t\t\t\t\t\t<CssParameter name="stroke">#000000</CssParameter>\r\n\t\t\t\t\t\t\t\t\t<CssParameter name="stroke-width">2</CssParameter>\r\n\t\t\t\t\t\t\t\t</Stroke>\r\n\t\t\t\t\t\t\t</Mark>\r\n\t\t\t\t\t\t\t<Size>12</Size>\r\n\t\t\t\t\t\t</Graphic>\r\n\t\t\t\t\t</PointSymbolizer>\r\n\t\t\t\t</Rule>\r\n\t\t\t</FeatureTypeStyle>\r\n\t\t</UserStyle>\r\n\t</NamedLayer>\r\n</StyledLayerDescriptor>',
				updated : "Tue Jan 31 16:07:33 EET 2012",
				created : "Wed Jan 18 14:11:29 EET 2012",
				wmsUrl : "wms",
				orderNumber : 2,
				name : "Palvelupisteiden kyselypalvelu",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				dataUrl_uuid : "",
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
				dataUrl : "",
				style : "",
				updated : "Wed Jan 25 16:50:14 EET 2012",
				wmsUrl : "http://kartta.suomi.fi/geoserver/wms",
				orderNumber : 100,
				name : "Palvelupisteet",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Yleishyödylliset ja muut julkiset palvelut",
				maxScale : 1
			},
			{
				dataUrl_uuid : "7a492bca-7107-4ed4-a4ca-4e951cb8bcea",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=7a492bca-7107-4ed4-a4ca-4e951cb8bcea",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/helsinki",
				orderNumber : 50,
				name : "Helsingin opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "f321f8eb-cc4b-4c4d-ac8a-0dc97306119c",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=f321f8eb-cc4b-4c4d-ac8a-0dc97306119c",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/helsinki",
				orderNumber : 70,
				name : "Helsingin ajantasa-asemakaava",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "2c7ca8c6-a47d-4209-8696-6545f2fae8b7",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=2c7ca8c6-a47d-4209-8696-6545f2fae8b7",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				orderNumber : 690,
				name : "Oulun asemakaava",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "b24ee665-4b2b-4d4b-bbff-135c20180d1d",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=b24ee665-4b2b-4d4b-bbff-135c20180d1d",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				orderNumber : 695,
				name : "Oulun ilmakuva 2004",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Ortoilmakuvat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "ad7a0bdd-eb14-4545-b76a-2b3f37733328",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=ad7a0bdd-eb14-4545-b76a-2b3f37733328",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				orderNumber : 700,
				name : "Oulun opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "1fd2501a-1f49-4c93-939a-5f3b8216d16d",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=1fd2501a-1f49-4c93-939a-5f3b8216d16d",
				style : "",
				wmsUrl : "http://wms.w.paikkatietoikkuna.fi/wms/oulu",
				orderNumber : 710,
				name : "Oulun osoitekartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Osoitteet",
				maxScale : 1
			},
			{
				dataUrl_uuid : "1ebaa413-6e87-4664-a2f1-b47228ed35b7",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=1ebaa413-6e87-4664-a2f1-b47228ed35b7",
				style : "",
				wmsUrl : "http://mbl.vihti.fi/VihtiWMS.mapdef?service=WMS&version=1.1.1",
				orderNumber : 1700,
				name : "Vihdin opaskartta",
				permissions : {
					publish : 2
				},
				opacity : 100,
				inspire : "Opaskartat",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 1,
				name : "Voimassa olevat kaivospiirit",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 2,
				name : "Kaivospiirihakemukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 3,
				name : "Karenssissa olevat kaivospiirit",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 4,
				name : "Voimassa olevat valtaukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 5,
				name : "Valtaushakemukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 6,
				name : "Karenssissa olevat valtaukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 7,
				name : "Voimassa olevat varaukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 8,
				name : "Varaushakemukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			},
			{
				dataUrl_uuid : "888e6229-9e2a-444c-8dff-214beae68971",
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
				dataUrl : "/catalogue/ui/metadata.html?uuid=888e6229-9e2a-444c-8dff-214beae68971",
				style : "",
				wmsUrl : "http://geomaps2.gtk.fi/ArcGIS/services/TEMkaivosrekisteri/MapServer/WMSServer",
				orderNumber : 9,
				name : "Karenssissa olevat varaukset",
				permissions : {
					publish : -1
				},
				opacity : 100,
				inspire : "Aluesuunnittelu ja rajoitukset",
				maxScale : 1
			} ]
});
/*
startup.mapConfigurations = {
	scale : 0,
	index_map : true,
	plane_list : true,
	width : 1000,
	north : "7204000",
	zoom_bar : true,
	pan : true,
	footer : true,
	height : 430,
	map_function : true,
	east : "470000",
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
startup.ogcXmlServiceEndpoint = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=xml.jsp";
startup.secureViewUrl = "http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=MapFull2_WAR_map2portlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_MapFull2_WAR_map2portlet_fi.mml.baseportlet.CMD=secureView";
startup.bundles = [];
startup.disableDevelopmentMode = "true";
startup.useGetFeatureInfoProxy = "true";
startup.printUrl = "/widget/web/fi/kartta-tulostus/-/MapPrint2_WAR_map2portlet";
startup.printWindowWidth = "880";
startup.printWindowHeight = "800";

*/