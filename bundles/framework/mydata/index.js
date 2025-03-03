import './instance';

// register create function for bundleid
Oskari.bundle('mydata', () => Oskari.clazz.create('Oskari.mapframework.bundle.mydata.MyDataBundleInstance'));
