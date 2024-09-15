/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.catalogue.bundle.metadata.MetadataBundle
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadata.MetadataBundle',
    /**
     * Called automatically on construction. At this stage bundle sources have been
     * loaded, if bundle is loaded dynamically.
     *
     * @contructor
     * @static
     */
    function () {

    }, {
        /*
        * called when a bundle instance will be created
        *
        * @method create
        */
        create: function () {
            return Oskari.clazz.create(
                'Oskari.catalogue.bundle.metadata.MetadataBundleInstance'
            );
        },
        /**
         * Called by Bundle Manager to provide state information to
         *
         * @method update
         * bundle
         */
        update: function (manager, bundle, bi, info) {
        }
    },

    /**
     * metadata
     */
    {
        protocol: ['Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
        source: {
            scripts: [
                {
                    type: 'text/javascript',
                    src: './instance.js'
                }, {
                    type: 'text/javascript',
                    src: './request/ShowMetadataRequest.js'
                }, {
                    type: 'text/javascript',
                    src: './request/ShowMetadataRequestHandler.js'
                }
            ],
            locales: [
                {
                    lang: 'fi',
                    type: 'text/javascript',
                    src: './resources/locale/fi.js'
                },
                {
                    lang: 'en',
                    type: 'text/javascript',
                    src: './resources/locale/en.js'
                },
                {
                    lang: 'sv',
                    type: 'text/javascript',
                    src: './resources/locale/sv.js'
                }, {
                    lang: 'is',
                    type: 'text/javascript',
                    src: './resources/locale/is.js'
                },
                {
                    lang: 'fr',
                    type: 'text/javascript',
                    src: './resources/locale/fr.js'
                },
                {
                    lang: 'ru',
                    type: 'text/javascript',
                    src: './resources/locale/ru.js'
                }
            ]
        }
    }
);

// Install this bundle by instantating the Bundle Class
Oskari.bundle_manager.installBundleClass('metadataflyout', 'Oskari.catalogue.bundle.metadata.MetadataBundle');
