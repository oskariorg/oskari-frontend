import './instance';

// register create function for bundleid
Oskari.bundle('statsgrid', () => Oskari.clazz.create('Oskari.statistics.statsgrid.StatsGridBundleInstance', 'statsgrid'));
