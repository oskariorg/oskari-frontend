export const TYPE = {
    POPUP: 'popup',
    FLYOUT: 'flyout',
    BANNER: 'banner',
    SIDE_PANEL: 'sidePanel'
};
// activeComponents has id + type as key and remove function as value
let activeComponents = {};
const getRegisterKey = (id, type) => type + '_' + id;
export const REGISTER = {
    clear: (key) => {
        if (key) {
            if (typeof activeComponents[key] === 'function') {
                // call remove function
                activeComponents[key]();
            }
            // remove reference to window
            delete activeComponents[key];
        } else {
            Object.values(activeComponents).forEach(o => typeof o === 'function' && o());
            activeComponents = {}
        }
    },
    registerWindow: (id, type, removeFn) => {
        const key = getRegisterKey(id, type);
        activeComponents[key] = removeFn;
        return key;
    },
    getExistingWindow: (id, type) => {
        return activeComponents[getRegisterKey(id, type)];
    }
};
