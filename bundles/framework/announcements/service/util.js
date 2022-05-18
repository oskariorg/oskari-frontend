const RANGE_SEPARATOR = '\u2013';
const TIME_OPTIONS = {
    hour: '2-digit',
    minute: '2-digit'
};

export const formatDate = (isoDateTime) => {
    const dateTime = new Date(isoDateTime);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], TIME_OPTIONS);

    return `${time} ${date}`;
};

export const getDateRange = (announcement) => {
    const start = formatDate(announcement.beginDate);
    const end = formatDate(announcement.endDate);
    return start + RANGE_SEPARATOR + end;
};

export const isIncoming = (announcement) => {
    return new Date(announcement.beginDate) - new Date() > 0;
};

export const isOutdated = (announcement) => {
    return new Date(announcement.endDate) - new Date() < 0;
};
