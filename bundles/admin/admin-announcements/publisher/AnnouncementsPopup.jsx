import { showPopup } from 'oskari-ui/components/window';
import React from 'react';
import { Checkbox, Message, WarningIcon } from 'oskari-ui';
import styled from 'styled-components';
import { getDateRange, isOutdated } from '../../../framework/announcements/service/util';
import { PrimaryButton } from 'oskari-ui/components/buttons';

const PopupContentContainer = styled('div')`
    margin: 1em;
    width: 25vw;
    display: flex;
    flex-direction: column;
`;

const Disclaimer = styled('div')`
    margin-bottom: 1em;
    flex-grow: 0;
`;

const PopupContent = styled('div')`
    flex-grow: 1;
    max-height: 50vh;
    overflow-y: auto;
`;

const Footer = styled('div')`
    flex-grow: 0;
    margin: 0 auto;
`;

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const ColHeading = styled('div')`
    font-weight: bold;
`;

const Col = styled('div')`
`;

const getContent = (state, controller, onClose) => {
    const { announcements, selectedAnnouncements, lang } = state;
    /*
    let { announcements } = state;
    announcements = announcements.concat(announcements).concat(announcements).concat(announcements);
    */
    const title = <Message bundleKey='admin-announcements' messageKey='tool.popup.title'/>;

    const content = <PopupContentContainer>
        <Disclaimer>
            <Message bundleKey='admin-announcements' messageKey='tool.popup.disclaimer'/>
        </Disclaimer>
        <PopupContent>
            <Row>
                <ColHeading>
                    <Message bundleKey='admin-announcements' messageKey='tool.announcementsName'></Message>
                </ColHeading>
                <ColHeading>
                    <Message bundleKey='admin-announcements' messageKey='tool.announcementsTime'></Message>
                </ColHeading>
            </Row>
            {announcements.map((announcement) => {
                const dateRange = getDateRange(announcement);
                const daterangeOutdated = isOutdated(announcement);

                return <Row key={announcement.id}>
                    <Col>
                        <Checkbox
                            onChange={(e) => controller.updateSelectedAnnouncements(e.target.checked, announcement.id)}
                            checked = { !daterangeOutdated && !!selectedAnnouncements?.includes(announcement.id)}
                            disabled={daterangeOutdated}>
                            {Oskari.getLocalized(announcement.locale, lang)?.title} {daterangeOutdated && <WarningIcon/>}
                        </Checkbox>
                    </Col>
                    <Col>{dateRange}</Col>
                </Row>;
            })}
        </PopupContent>
        <Footer>
            <PrimaryButton type={'close'} onClick={onClose}/>
        </Footer>
    </PopupContentContainer>;

    return {
        title,
        content
    };
};

export const showAnnouncementsPopup = (state, controller, onClose) => {
    const { title, content } = getContent(state, controller, onClose);
    const controls = showPopup(title, content, onClose, {});
    return {
        ...controls,
        update: (state) => {
            const { title, content } = getContent(state, controller, onClose);
            controls.update(title, content);
        }
    };
};
