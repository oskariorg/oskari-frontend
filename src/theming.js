import { setGlobalStyle } from './react/theme';

const DEFAULT_THEME = {
    color: {
        icon: '#3c3c3c',
        accent: '#ffd400',
        primary: '#fdf8d9'
    }
};

let currentTheme = {
    ...DEFAULT_THEME
};
let listeners = [];

export const THEMING = {
    getTheme () {
        return cloneDeep(currentTheme);
    },
    setTheme (newTheme = {}) {
        // start with new object so we bust any memoized value for listeners and get a good value for reset as well
        currentTheme = merge({}, DEFAULT_THEME, newTheme);
        setGlobalStyle(currentTheme);
        listeners.forEach(l => l(currentTheme));
    },
    /**
     * @param {Function} listener function to call with new theme object if theme changes
     * @returns function to call for removing the listener (for cleanup)
     */
    addListener (listener) {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
        return () => {
            listeners = [...listeners.filter(fn => fn !== listener)];
        };
    }
};

// simple deep cloning for theme purposes
const cloneDeep = (original) => {
    if (!original) {
        return original;
    }
    const theClone = Array.isArray(original) ? [] : {};
    for (const key in original) {
        const value = original[key];
        theClone[key] = (typeof value === 'object') ? cloneDeep(value) : value;
    }
    return theClone;
};

// merge from https://thewebdev.info/2021/03/06/how-to-deep-merge-javascript-objects/
const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const merge = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {
                        [key]: {}
                    });
                }
                merge(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }

    return merge(target, ...sources);
};
