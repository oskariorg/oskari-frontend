let theme = {
    color: {
        icon: '#3c3c3c',
        accent: '#ffd400',
        primary: '#fdf8d9'
    }
};
const listeners = [];

export const THEMING = {
    getTheme () {
        return theme;
    },
    setTheme (newTheme) {
        theme = newTheme;
        listeners.forEach(l => l(theme));
    },
    addListener (listener) {
        if (typeof listener === 'function') {
            listeners.push(listener);
        }
    }
};