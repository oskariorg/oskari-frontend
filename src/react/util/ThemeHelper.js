
export const getHeaderTheme = (theme) => {
    return {
        getBgColor: () => theme.color.primary,
        getToolIconColor: () => theme.color.icon,
        getToolIconHoverColor: () => theme.color.accent
    };
};
