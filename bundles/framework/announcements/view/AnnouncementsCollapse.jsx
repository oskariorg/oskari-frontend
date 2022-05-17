import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsContent } from './';

// Collapse panel -> set title, locale and date range according to announcement

const TIME_OPTIONS = {
    hour: '2-digit',
    minute: '2-digit'
};
const RANGE_SEPARATOR = '\u2013';

const formatDate = (isoDateTime) => {
    const dateTime = new Date(isoDateTime);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], TIME_OPTIONS);

    return `${time} ${date}`;
};

export const AnnouncementsCollapse = ({
    announcements
}) => {
    if (!announcements.length) {
        return (
            <Message messageKey={'noAnnouncements'}/>
        );
    }
    return (
        <div>
            <Collapse accordion>
                { announcements.map((announcement) => {
                    const { name } = Oskari.getLocalized(announcement.locale);
                    const start = formatDate(announcement.beginDate);
                    const end = formatDate(announcement.endDate);
                    const dateRange = start + RANGE_SEPARATOR + end;
                    return (
                        <CollapsePanel header={name} key={announcement.id}>
                            <AnnouncementsContent announcement={announcement}/>
                            <Divider />
                            <b><Message messageKey={'valid'} /></b>
                            <p>{dateRange}</p>
                        </CollapsePanel>
                    );
                })}
            </Collapse>
        </div>
    );
};

AnnouncementsCollapse.propTypes = {
    announcements: PropTypes.array.isRequired
};
