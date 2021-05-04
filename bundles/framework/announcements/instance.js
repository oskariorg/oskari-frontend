/**
 * @class Oskari.framework.bundle.announcements.AnnouncementsBundleInstance
 *
 * Main component and starting point for the announcements functionality.
 *
 * See Oskari.framework.bundle.announcements.AnnouncementsBundleInstance for bundle definition.
 */
Oskari.clazz.define('Oskari.framework.bundle.announcements.AnnouncementsBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        var conf = this.getConfiguration();
        conf.name = 'announcements';
        conf.flyoutClazz = 'Oskari.framework.bundle.announcements.Flyout';
    }, {
        

        afterStart: function () {
            // listen to application started event and register new RPC function.
            Oskari.on('app.start', function (details) {
                const rpcService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.rpc.service.RpcService');
                if (!rpcService) {
                    return;
                }
                console.log(rpcService);
                rpcService.addFunction('getAnnouncements', function () {
                    console.log('New added RPC function');
                    var data = [];
                    jQuery.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: Oskari.urls.getRoute('Announcements'),
                        success: (pResp) => {
                            console.log("HAKUU");
                            data = pResp;
                        },
                        error: function (jqXHR, textStatus) {
                        }
                    });
                    return data;
                });
                
                console.log(rpcService);
            });
        }

    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
