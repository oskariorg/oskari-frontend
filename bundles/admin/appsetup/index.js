import './instance';
import './resources/scss/style.scss';

// register create function for bundleid
Oskari.bundle('appsetup', () => Oskari.clazz.create('Oskari.admin.bundle.appsetup.AppSetupAdminBundleInstance'));
