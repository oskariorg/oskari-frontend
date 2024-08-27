/**
 * @class Oskari.mapframework.bundle.layerswipe.LayerSwipeBundle
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.layerswipe.LayerSwipeBundle',
    function () {},
    {
        create: function () {
            return Oskari.clazz.create('Oskari.mapframework.bundle.layerswipe.LayerSwipeBundleInstance');
        },
        update: function (manager, bundle, bi, info) {}
    },
    {
        protocol: ['Oskari.bundle.Bundle', 'Oskari.mapframework.bundle.extension.ExtensionBundle'],
        source: {
            scripts: [
                {
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/instance.js'
                },
                {
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/plugin/LayerSwipePlugin.js'
                },
                {
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/publisher/SwipeTool.js'
                },
                {
                    type: 'text/css',
                    src: '../../../../bundles/mapping/layerswipe/resources/css/layerswipe.css'
                }
            ],
            locales: [
                {
                    lang: 'en',
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/resources/locale/en.js'
                },
                {
                    lang: 'fi',
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/resources/locale/fi.js'
                },
                {
                    lang: 'sv',
                    type: 'text/javascript',
                    src: '../../../../bundles/mapping/layerswipe/resources/locale/sv.js'
                }
            ]
        }
    }
);

Oskari.bundle_manager.installBundleClass('layerswipe', 'Oskari.mapframework.bundle.layerswipe.LayerSwipeBundle');
