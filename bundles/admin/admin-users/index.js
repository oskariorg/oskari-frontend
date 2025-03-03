import './instance';

// register create function for bundleid
Oskari.bundle('admin-users', () => Oskari.clazz.create('Oskari.mapframework.bundle.admin-users.AdminUsersBundleInstance',
    'admin-users',
    'Oskari.framework.bundle.admin-users.AdminUsersFlyout'
));
