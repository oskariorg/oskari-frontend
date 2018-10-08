/**
 * @class Oskari.mapframework.bundle.telemetry.TelemetryBundleInstance
 */
Oskari.clazz.define('Oskari.mapframework.bundle.telemetry.TelemetryBundleInstance', function () {

}, {
    __name: 'TelemetryBundleInstance',
    eventHandlers: {
        'userinterface.ExtensionUpdatedEvent': function (event) {
            if (event.getViewState() === 'attach') {
                this._pushEvent('Tile', event.getExtension().getName());
            }
        }
    },
    _startImpl: function (sandbox) {
        var endpoint = this.conf.endpoint;
        if (!endpoint) {
            Oskari.log(this.getName()).warn('No "endpoint" in conf. Telemetry bundle will not start.');
            this.stop(sandbox);
            return;
        }
        if (location.hostname === 'localhost') {
            this.stop(sandbox);
            return;
        }
        this._initTelemetry(endpoint);
        var me = this;
        jQuery('#maptools').on('click', '#toolbar .toolrow .tool', function (event) {
            var el = jQuery(this);
            if (el.hasClass('disabled')) {
                return;
            }
            me._pushEvent('Toolbar', el.attr('tool'));
        });
        jQuery('#mapdiv .mapplugin.mylocationplugin').on('click', function (event) {
            me._pushEvent('Maptools', 'mylocationtool');
        });
        jQuery('#mapdiv .mapplugin.coordinatetool').on('click', function (event) {
            me._pushEvent('Maptools', 'coordinatetool');
        });
    },
    _initTelemetry: function (endpoint) {
        var _paq = window._paq = window._paq || [];
        _paq.push(['setDomains', ['*.kartta.paikkatietoikkuna.fi']]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
            var u = '//' + endpoint + '/';
            _paq.push(['setTrackerUrl', u + 'piwik.php']);
            _paq.push(['setSiteId', 9]);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript'; g.async = true; g.defer = true; g.src = u + 'piwik.js'; s.parentNode.insertBefore(g, s);
        })();
    },
    _pushEvent: function (/* variadic */) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('trackEvent');
        window._paq.push(args);
    }
}, {
    'extend': ['Oskari.BasicBundle'],
    'protocol': ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
});