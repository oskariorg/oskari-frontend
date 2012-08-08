Oskari
		.$(
				'Oskari.NLSFI.OpenLayers.Format.GML.ArcInterPoints',
				OpenLayers
						.Class( {

							initialize : function() {
								return this;
							},
							arcInterPointsFromPosList : function(points) {
								return this.InterPoints(points[0], points[2],
										points[1], 7, 1.0);
							},
							InterPoints : function(xsys, xeye, x0y0,
									nrIntPoints, w) {

								// Laskee välipisteitä ympyrän kaarelle,
								// Math.pow(2,nrIntPoints)+1 kappaletta
								// Parametrit: katso metodi doInterPoints

								// double[] int_points;
								var int_points = [];

								// alle 1 metrin väleille ei lasketa
								// välipisteitä
								// double d = Point2D.distance(xs,ys,xe,ye);
								var d = xsys.distanceTo(xeye);
								if (d < 1) {
									int_points.push(xsys);
									int_points.push(xeye);
									return int_points;
								}

								int_points = this.doInterPoints(xsys.x, xsys.y,
										xeye.x, xeye.y, x0y0.x, x0y0.x,
										nrIntPoints, w);

								return int_points;

							},

							doInterPoints : function(xs, ys, xe, ye, x0, y0,
									nrIntPoints, w) {

								// Laskee Math.pow(2,nrIntPoints)+1 kappaletta
								// välipisteitä ympyrän kaarelle, jonka
								// parametrit ovat:
								// xs, ys = kaaren alkupisteen koordinaatit
								// xe, ye = kaaren loppupisteen koordinaatit
								// x0, y0 = kaarta vastaavan ympyrän
								// keskipisteen koordinaatit
								// w = painokerroin (weight)

								var vali_piste_lkm = Math.floor(Math.pow(2,
										nrIntPoints) + 1);

								if (nrIntPoints < 1) {
									return [];
								}

								var intPoints = new Array(vali_piste_lkm);// [];

								intPoints[0] = new OpenLayers.Geometry.Point(
										xs, ys);
								intPoints[vali_piste_lkm - 1] = new OpenLayers.Geometry.Point(
										xe, ye);

								for (k = nrIntPoints; k > 0; k--) {

									var k1 = Math.floor(Math.pow(2, k));
									var k2_ed = -1;
									for (k2 = 0; k2 < vali_piste_lkm; k2 += k1) {
										if (k2_ed > -1) {
											var apx = intPoints[k2_ed].x;
											var apy = intPoints[k2_ed].y;
											var lpx = intPoints[k2].x;
											var lpy = intPoints[k2].y;
											var valip = this.kaarenValipiste(
													apx, apy, lpx, lpy, x0, y0,
													w);
											intPoints[Math.floor((k2 - k2_ed)
													/ 2 + k2_ed)] = valip;
											if (w < 1.0)
												w = 1.1;
										}
										k2_ed = k2;
									}
								}

								return intPoints;

							},

							kaarenValipiste : function(xs, ys, xe, ye, x0, y0,
									w) {
								// xs, ys = kaaren alkupisteen koordinaatit
								// xe, ye = kaaren loppupisteen koordinaatit
								// w = paino (weight) keskipisteelle

								var sade;
								var sade1 = Math.sqrt((x0 - xs) * (x0 - xs)
										+ (y0 - ys) * (y0 - ys));
								var sade2 = Math.sqrt((x0 - xe) * (x0 - xe)
										+ (y0 - ye) * (y0 - ye));

								sade = Math.max(sade1, sade2);

								var suunta1 = Math.acos((xs - x0) / sade);

								if (ys < y0)
									suunta1 = -1 * suunta1;

								var suunta2 = Math.acos((xe - x0) / sade);
								if (ye < y0)
									suunta2 = -1 * suunta2;
								while (suunta2 < suunta1)
									suunta2 = suunta2 + 2 * Math.PI;
								var suunta3 = (suunta2 + suunta1) / 2.0;

								var arcx1 = Math.cos(suunta3) * sade + x0;
								var arcy1 = Math.sin(suunta3) * sade + y0;
								var et_1 = Math.sqrt((arcx1 - xs)
										* (arcx1 - xs) + (arcy1 - ys)
										* (arcy1 - ys));

								var arcx2 = x0 - Math.cos(suunta3) * sade;
								var arcy2 = y0 - Math.sin(suunta3) * sade;
								var et_2 = Math.sqrt((arcx2 - xs)
										* (arcx2 - xs) + (arcy2 - ys)
										* (arcy2 - ys));

								var vali_piste = new OpenLayers.Geometry.Point(
										0, 0);

								if (w < 1.0) {
									if (et_1 < et_2) {
										vali_piste.x = arcx2;
										vali_piste.y = arcy2;
									} else {
										vali_piste.x = arcx1;
										vali_piste.y = arcy1;
									}
								} else {
									if (et_1 < et_2) {
										vali_piste.x = arcx1;
										vali_piste.y = arcy1;
									} else {
										vali_piste.x = arcx2;
										vali_piste.y = arcy2;
									}
								}

								return vali_piste;

							}
						}));
