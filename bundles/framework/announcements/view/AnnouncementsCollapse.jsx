import React from 'react';
import PropTypes from 'prop-types';
import { Message, Collapse, CollapsePanel, Divider } from 'oskari-ui';
import { AnnouncementsContent } from './';
import { getDateRange } from '../service/util';

// Collapse panel -> set title, locale and date range according to announcement

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
                    const { title } = Oskari.getLocalized(announcement.locale);
                    const dateRange = getDateRange(announcement);
                    return (
                        <CollapsePanel header={title} key={announcement.id}>
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
