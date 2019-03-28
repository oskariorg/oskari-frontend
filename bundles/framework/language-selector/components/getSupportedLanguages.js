let supportedLanguages;

export const getSupportedLanguages = () => {
    if (!supportedLanguages) {
        supportedLanguages = Oskari.getSupportedLanguages();
    }
    return supportedLanguages;
};
