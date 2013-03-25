/**
 * @class Oskari.paikkatietoikkuna.Main
 *
 * Launcher class for a paikkatietoikkuna.fi map window
 */
Oskari.clazz.define('Oskari.paikkatietoikkuna.Main', function() {

    this.args = null;
    this.styleBndl = null;
}, {

    /**
     * @method processArgs
     *
     * applies page args to this instance
     */
    processArgs: function(args) {
        this.args = args;
        this.styleBndl = args.style;
    },
    /**
     * @method start
     *
     * starts the application with bundle definitions declared
     * in property appSetup.startupSequence
     */
    start: function(cb) {

        var me = this;

        var appSetup = this.appSetup;
        var appConfig = this.appConfig;
        var app = Oskari.app;

        app.setApplicationSetup(appSetup);
        app.setConfiguration(appConfig);
        app.startApplication(function(startupInfos) {
            me.instance = startupInfos.bundlesInstanceInfos.mapfull.bundleInstance;
            if (cb) {
                cb(me.instance);
            }
            /*
            var ugStartup = {
                'bundleinstancename': 'patiopoc',
                'bundlename': 'patiopoc',
                'metadata': {
                    'Import-Bundle': {
                        'patiopoc': {
                            'bundlePath': '/Oskari/packages/statistics/bundle/'
                        }
                    }
                }
            };
            Oskari.bundle_facade.playBundle(ugStartup, function() {});
            */
        });
    },
    /**
     * @static
     * @property appConfig
     */
    appConfig: {
        // this will be replaced from GetAppSetup
    },

    /**
     * @static
     * @property appSetup.startupSequence
     */
    appSetup: {

        // this will be replaced from GetAppSetup
        startupSequence: []
    }
});

/**
 * Start when dom ready
 */
jQuery(document).ready(function() {
    var args = {
        oskariLoaderMode: 'dev',
        style: 'style1'
    };

    if (!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    function getURLParameter(name) {
        var re = name + '=' + '([^&]*)(&|$)';
        var value = RegExp(re).exec(location.search);
        if (value && value.length && value.length > 1) {
            value = value[1];
        }
        if (value) {
            return decodeURI(value);
        }
        return null;
    }

    // returns empty string if parameter doesn't exist
    // otherwise returns '<param>=<param value>&'

    function getAdditionalParam(param) {
        var value = getURLParameter(param);
        if (value) {
            return param + '=' + value + '&';
        }
        return '';
    }

    var args = {
        oskariLoaderMode: 'yui',
        style: 'style1'
    };
    if (!ajaxUrl) {
        alert('Ajax URL not set - cannot proceed');
        return;
    }

    // populate url with possible control parameters
    ajaxUrl += getAdditionalParam('zoomLevel');
    ajaxUrl += getAdditionalParam('coord');
    ajaxUrl += getAdditionalParam('mapLayers');
    ajaxUrl += getAdditionalParam('oldId');
    ajaxUrl += getAdditionalParam('viewId');

    ajaxUrl += getAdditionalParam('isCenterMarker');
    ajaxUrl += getAdditionalParam('address')
    ajaxUrl += getAdditionalParam('showGetFeatureInfo');
    ajaxUrl += getAdditionalParam('nationalCadastralReference');

    ajaxUrl += getAdditionalParam('nationalCadastralReferenceHighlight');
    ajaxUrl += getAdditionalParam('wfsFeature');
    ajaxUrl += getAdditionalParam('wfsHighlightLayer');

    if (!language) {
        // default to finnish
        language = 'fi';
    }
    Oskari.setLang(language);


    Oskari.setLoaderMode('dev');
    Oskari.setPreloaded(preloaded);

    // if (location.search && location.search.length > 1) {
    //     ajaxUrl +=
    //         location.search.substr(1, location.search.length) + '&';
    // }


    if (args.oskariLoaderAsync && args.oskariLoaderAsync == 'on') {
        Oskari.setSupportBundleAsync(true);
    }
    var main = Oskari.clazz.create('Oskari.paikkatietoikkuna.Main');
    main.processArgs(args);

    if (ajaxUrl.indexOf('http') == 0) {
        var hostIdx = ajaxUrl.indexOf('://') + 3;
        var pathIdx = ajaxUrl.indexOf('/', hostIdx);
        ajaxUrl = ajaxUrl.substring(pathIdx);
    }
    var gfiParamHandler = function(sandbox) {
        if (getURLParameter('showGetFeatureInfo') != 'true') {
            return;
        }
        var lon = sandbox.getMap().getX();
        var lat = sandbox.getMap().getY();
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        var px = mapModule.getMap().getViewPortPxFromLonLat({
            lon: lon,
            lat: lat
        });
        sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
    }
    // === Look for old mapfull state - cookie set in SaveViewPlugin.js   ===
    var cookiename = "mymapview1";
    var cookieviewdata = "";
    if (document.cookie.length > 0) {
        cookieStart = document.cookie.indexOf(cookiename + "=");
        if (cookieStart != -1) {
            cookieStart += cookiename.length + 1;
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieviewdata = document.cookie.substring(cookieStart, cookieEnd);

        }
    }
    var data = {
        viewData: cookieviewdata
    };
    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        beforeSend: function(x) {
            if (x && x.overrideMimeType) {
                x.overrideMimeType("application/j-son;charset=UTF-8");
                80
            }
        },
        url: ajaxUrl + 'action_route=GetAppSetup',
        data: data,
        success: function(appSetup) {
            if (appSetup.startupSequence && appSetup.configuration) {
                main.appSetup.startupSequence = appSetup.startupSequence;
                main.appConfig = appSetup.configuration;
                main.start(function(instance) {
                    var sb = instance.getSandbox();
                    gfiParamHandler(sb);
                });
            } else {
                jQuery('#mapdiv').append('Unable to start');
            }
        },
        error: function(jqXHR, textStatus) {
            if (jqXHR.status != 0) {
                jQuery('#mapdiv').append('Unable to start');
            }
        }
    });
});