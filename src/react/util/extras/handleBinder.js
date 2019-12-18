/**
 * Re-binds all object methods starting with prefix, so that methods can be used detached from instance. For use in React
 * @function handleBinder
 * @param {Object} ob - Object to bind functions to
 * @param {string} [prefix=handle] - Binds all functions starting with prefix
 */
export function handleBinder (ob, prefix = 'handle') {
    const proto = Object.getPrototypeOf(ob);
    Object.getOwnPropertyNames(proto).forEach(propertyName => {
        const desc = Object.getOwnPropertyDescriptor(proto, propertyName);
        if (!!desc && typeof desc.value === 'function' && propertyName.startsWith(prefix)) {
            ob[propertyName] = desc.value.bind(ob);
        }
    });
}
