import './instance';
import './publisher/AnnouncementsTool';
// looks like the scss file might be for jQuery base publisher tool, but it has been rerwitten with React
//  so it's probably not needed anymore
// TODO: remove after testing
// import './resources/scss/style.scss';

// register create function for bundleid
Oskari.bundle('admin-announcements', () => Oskari.clazz.create('Oskari.admin.admin-announcements.instance'));
