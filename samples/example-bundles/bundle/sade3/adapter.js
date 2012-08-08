Oskari.clazz
		.define(
				'Oskari.poc.sade3.Adapter',
				function(app, ui) {
					var w = app.getWorker();
					w
							.setAdapter(
									'rhr_osoitepiste',
									// 'rhr_rakennuksen_ominaisuustiedot',
									function(args, feats, request, requestXML) {

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {
												var feat = feats[n];
												if (feat.attributes.featType != 'Osoite')
													continue;
												ui.setAddress(feat.attributes);
												break;
											}
										}
									});
					w
							.setAdapter(
									'rhr_rakennuksen_ominaisuustiedot',
									function(args, feats, request, requestXML) {

										var store = app.getMediator().getStore(
												'RakennuksenOminaisuustiedot');
										store.removeAll(true);
										var recId = 0;

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {
												var feat = feats[n];
												if (feat.attributes.featType != 'RakennuksenOminaisuustiedot')
													continue;

												// lisätään rivi taulukkoon
												// feat.attributes pohjalta

												var r = Ext
														.create(
																'RakennuksenOminaisuustiedot',
																feat.attributes);
												r.setId(++recId);
												store.add(r);
											}
										}
									});
					w.setAdapter('ktj_rt', function(args, feats, request,
							requestXML) {

						if (feats && feats.length > 0) {
							var feat = feats[0];

							ui.setCU(feat.attributes);

							/*
							 * if(args.zoomToExtent)
							 * ui.getMap().zoomToExtent(feat.geometry.getBounds().scale(5));
							 */
							var lonlat = feat.geometry.getBounds().getCenterLonLat();
							ui.zoomTo(lonlat.lon,lonlat.lat);

						}
					});

					w
							.setAdapter(
									'ktj_pt',
									function(args, feats, request, requestXML) {

										var cuUniqueIdentifier = null;

										if (feats && feats.length == 1) {
											var feat = feats[0];
											cuUniqueIdentifier = feat.attributes.rekisteriyksikonKiinteistotunnus;
											ui
													.setCU( {
														kiinteistotunnus : cuUniqueIdentifier
													});
											/*
											 * if(args.zoomToExtent)
											 * ui.getMap().zoomToExtent(feat.geometry.getBounds().scale(5));
											 */
											var lonlat = feat.geometry.getBounds().getCenterLonLat();
											ui.zoomTo(lonlat.lon,lonlat.lat);
										}

										if (!cuUniqueIdentifier)
											return;

										w
												.searchAnyByCUQualifiedIdentifier(cuUniqueIdentifier);

									});
					w
							.setAdapter(
									'rhr_osoitenimi',
									function(args, feats, request, requestXML) {

										var cuUniqueIdentifier = null;

										if (feats && feats.length > 0) {
											for ( var n = 0; n < feats.length; n++) {

												var feat = feats[n];

												ui.setAddress(feat.attributes);
												cuUniqueIdentifier = feat.attributes.kiinteistotunnus;

											}
										}

										if (!cuUniqueIdentifier)
											return;

										w.searchAnyByCUQualifiedIdentifier(
												cuUniqueIdentifier, {
													zoomToExtent : true
												});
									});
					w.setAdapter('mtk_osoitenimi', function(args, feats,
							request, requestXML) {

						var cuUniqueIdentifier = null;

						if (feats && feats.length > 0) {
							for ( var n = 0; n < feats.length; n++) {

								var feat = feats[n];

								ui.setAddress(feat.attributes);
								// cuUniqueIdentifier =
							// feat.attributes.kiinteistotunnus;

							var lonlat = new OpenLayers.LonLat(feat.geometry.x,
									feat.geometry.y);
							w.searchAnyByLonLat(lonlat, null, null, {
								zoomToExtent : true
							});
							break;
						}
					}

				}	);

				}, {});
