const BasicBundle = Oskari.clazz.get('Oskari.BasicBundle');
/**
 * @class SimpleBundleInstance
 * @hideconstructor
 * @classdesc
 *
 * This bundle demonstrates a simplest possible bundle that will just alert a Hello message on startup.
 * See source for details.
 *
 * @see BasicBundle
 * @see SimpleBundle
 */
class SimpleBundleInstance extends BasicBundle {
    constructor () {
        super();
        this.__name = 'Oskari.sample.bundle.mymodernbundle.SimpleBundleInstance';
    }
    _startImpl () {
        alert(`Hello from ${this.getName()}!`);
    }
}
Oskari.clazz.defineES('Oskari.sample.bundle.mymodernbundle.SimpleBundleInstance', SimpleBundleInstance);
