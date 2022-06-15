
export const getHeaderTheme = (theme) => {
    return {
        getBgColor: () => theme.color.primary,
        getAccentColor: () => theme.color.accent,
        getToolIconColor: () => theme.color.icon,
        getToolIconHoverColor: () => theme.color.accent
    };
};
