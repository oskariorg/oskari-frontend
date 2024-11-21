import React from 'react';
import { PropTypes } from 'prop-types';
import { Message, Checkbox, Button } from 'oskari-ui';
import styled from 'styled-components';

const Col = styled('div')`
    display: flex;
    flex-direction: column;
`;

const SelectedAnnouncements = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 1em;
`;

const SelectedAnnouncementsTitle = styled('div')`
    font-weight: bold;
`;

const SelectedAnnouncementsText = styled('div')`
    font-style: italic;
`;

const SelectedAnnouncement = ({ announcement, lang }) => {
    return <SelectedAnnouncementsText>{ Oskari.getLocalized(announcement.locale, lang)?.title }</SelectedAnnouncementsText>;
};

const SelectButton = styled(Button)`
    margin-top: 0.5em;
    width: 50%;
`;

SelectedAnnouncement.propTypes = {
    announcement: PropTypes.object,
    lang: PropTypes.string
};

export const AnnouncementToolComponent = ({ state, controller }) => {
    const { noUI, announcements, selectedAnnouncements } = state;

    return (
        <Col>
            <Checkbox checked={noUI} onChange={ evt => controller.setNoUI(evt.target.checked) }>
                <Message bundleKey={'admin-announcements'} messageKey={'publisher.noUI'}/>
            </Checkbox>

            <SelectedAnnouncements>
                <Message LabelComponent={SelectedAnnouncementsTitle} bundleKey={'admin-announcements'} messageKey={'publisher.selectedAnnouncementsTitle'} />
                { announcements
                    .filter((ann) => selectedAnnouncements?.includes(ann.id))
                    .map((announcement) => {
                        return <SelectedAnnouncement key={ announcement.id } announcement={announcement} lang={state?.lang}/>;
                    })
                }
            </SelectedAnnouncements>
            <SelectButton onClick={() => controller.showPopup()}>
                <Message bundleKey={'admin-announcements'} messageKey={'tool.buttonLabel'}/>
            </SelectButton>

        </Col>);
};

AnnouncementToolComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
