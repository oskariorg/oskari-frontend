const RANGE_SEPARATOR = '\u2013';

export const getDateRange = (announcement) => {
    const start = Oskari.util.formatDate(announcement.beginDate);
    const end = Oskari.util.formatDate(announcement.endDate);
    return start + RANGE_SEPARATOR + end;
};

export const isUpcoming = (announcement) => {
    return new Date(announcement.beginDate) - new Date() > 0;
};

export const isOutdated = (announcement) => {
    return new Date(announcement.endDate) - new Date() < 0;
};
export const isActive = (announcement) => {
    return !isOutdated(announcement) && !isUpcoming(announcement);
};
