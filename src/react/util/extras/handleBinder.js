/**
 * re-binds all object methods starting with 'handle',
 * so that methods can be used detached from instance. For use in React
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
