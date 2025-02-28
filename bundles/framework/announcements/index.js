import './instance';

// register create function for bundleid
Oskari.bundle('announcements', () => Oskari.clazz.create('Oskari.framework.bundle.announcements.AnnouncementsBundleInstance'));
