// imports for GenericAdminBundleInstance
import './instance.js';
import './DefaultViews.js';
import './request/AddTabRequest.js';
import './Flyout.js';

// register create function for bundleid
Oskari.bundle('admin', () => Oskari.clazz.create('Oskari.admin.bundle.admin.GenericAdminBundleInstance',
    'GenericAdmin',
    'Oskari.admin.bundle.admin.GenericAdminFlyout')
);
