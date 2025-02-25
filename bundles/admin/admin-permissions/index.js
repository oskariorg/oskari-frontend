import './instance';

// register create function for bundleid
Oskari.bundle('admin-permissions', () => Oskari.clazz.create('Oskari.admin.bundle.admin-permissions.AdminPermissionsBundleInstance',
    'admin-permissions',
    'Oskari.admin.bundle.admin-permissions.AdminPermissionsFlyout'
));
