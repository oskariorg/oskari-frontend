import '../../../../../../../../src/global';
import { initServices, getBundleInstance } from '../../../test.util';

initServices();

export const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');
export const instance = getBundleInstance();
