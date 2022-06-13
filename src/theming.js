import merge from 'lodash/merge';
import cloneDeep  from 'lodash/clonedeep';

const DEFAULT_THEME = {
    color: {
        icon: '#3c3c3c',
        accent: '#ffd400',
        primary: '#fdf8d9'
    }
};

let theme = {
    ...DEFAULT_THEME
};
let  listeners = [];

export const THEMING = {
    getTheme () {
        return cloneDeep(theme);
    },
    setTheme (newTheme = DEFAULT_THEME) {
        // spread so we bust any memoized value for listeners
        theme = {...merge(DEFAULT_THEME, newTheme)};
        listeners.forEach(l => l(theme));
    },
    /**
     * 
     * @param {Function} listener function to call with new theme object if theme changes
     * @returns function to call for removing the listener (for cleanup)
     */
    addListener (listener) {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
        return () => {
            listeners = [...listeners.filter(fn => fn !== listener)];
        }
    }
};
