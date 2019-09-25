Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.request.MapTourRequestHandler',
    function (sandbox, mapModule) {
        this.sandbox = sandbox;
        this.mapModule = mapModule;
    }, {
        handleRequest: function (core, request) {
            const requestZoom = request.getZoom();
            const srsName = request.getSrsName();
            const animation = request.getAnimation();
            const locations = request.getLocations();
            const options = { animation: animation };
            const lonlat = locations.map(loc => this.mapModule.transformCoordinates(loc, srsName));
            let zoom;
            if (requestZoom != null) {
                zoom = requestZoom.scale
                    ? { type: 'scale', value: this.mapModule.getResolutionForScale(requestZoom.scale) }
                    : { type: 'zoom', value: requestZoom };
            }

            this.mapModule.tourMap(lonlat, zoom, options);
        }
    }, {
        protocol: ['Oskari.mapframework.core.RequestHandler']
    }
);
