import { DEFAULT_COLORS } from 'oskari-ui/theme';

const CSS_CLASS_PREFIX_FONT = 'oskari-theme-font-';

export const getDefaultMapTheme = () => {
    return {
        // For buttons on map
        navigation: {
            roundness: 100,
            opacity: 0.8,
            color: {
                primary: DEFAULT_COLORS.DARK_BUTTON_BG,
                accent: DEFAULT_COLORS.ACCENT,
                text: '#ffffff'
            }
        },
        // /For buttons on map ^
        // --------------
        // For popup headers opened by map:
        color: {
            header: {
                // #3c3c3c -> rgb(60,60,60)
                bg: '#3c3c3c'
            }
            // accent should be inherited from global theme accent if not configured
            // accent: '#ffd400'
        },
        // /For popup headers opened by map ^
        // ----------------------------------
        // For gfi infoboxes:
        infobox: {
            color: {
                bg: '#424343',
                text: '#FFFFFF'
            }
        }
        // /For gfi infoboxes ^
    };
};

// set font class for map module/map controls. Windows/popups will get it through theme
export const setFont = (mapEl, requestedFont = 'arial') => {
    // on unit tests the mapEl might be undefined
    const classlist = mapEl?.classList;
    if (!classlist) {
        return;
    }
    const newFontClass = CSS_CLASS_PREFIX_FONT + (requestedFont || 'arial');
    classlist.forEach(clazz => {
        if (clazz !== newFontClass && clazz.startsWith(CSS_CLASS_PREFIX_FONT)) {
            classlist.remove(clazz);
        }
    });
    classlist.add(newFontClass);
};
