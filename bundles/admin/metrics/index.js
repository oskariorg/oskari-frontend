import './instance';
import '../../../libraries/jquery/plugins/jqtree/jqtree-1.2.1.js';
import '../../../libraries/jquery/plugins/jqtree/jqtree.css';

// register create function for bundleid
Oskari.bundle('metrics', () => Oskari.clazz.create('Oskari.admin.bundle.metrics.MetricsAdminBundleInstance'));
