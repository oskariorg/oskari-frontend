import './instance';
// make the publisher tool available for publisher when this is loaded/registered
import './publisher/AnnouncementsTool';

// register create function for bundleid
Oskari.bundle('admin-announcements', () => Oskari.clazz.create('Oskari.admin.admin-announcements.instance'));
