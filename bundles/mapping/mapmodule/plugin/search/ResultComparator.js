export const isSameResult = (a = {}, b = {}) => {
    if (a.channelId !== b.channelId) {
        return false;
    }
    if (a.id && b.id && a.id === b.id) {
        // not all results have ids but if they do match we have a winner
        return true;
    }
    return Object.keys(a).every(propName => a[propName] === b[propName]);
};
