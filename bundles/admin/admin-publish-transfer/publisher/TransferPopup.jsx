import { showPopup } from 'oskari-ui/components/window';
import React from 'react';
import { Message, WarningIcon } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';

import styled from 'styled-components';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { BUNDLE_KEY } from './TransferTool';
/*
import { getDateRange, isOutdated } from '../../../framework/announcements/service/util';
*/
const PopupContentContainer = styled('div')`
    margin: 1em;
    width: 25vw;
    display: flex;
    flex-direction: column;
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

const Disclaimer = styled('div')`
    margin-bottom: 1em;
    flex-grow: 0;
`;

const getContent = (state, controller, onClose) => {
    // FIXME: actual content for the popup
    const title = <Message bundleKey={{ BUNDLE_KEY }} messageKey='tool.popup.title'/>;

    const content = <PopupContentContainer>
        <LocaleProvider value={{ BUNDLE_KEY }}>
            <Disclaimer>
                <WarningIcon /><Message messageKey='tool.popup.disclaimer'/>
            </Disclaimer>
            <PopupContent>
                <Row>
                    <ColHeading>
                        <Message messageKey='tool.announcementsName'></Message>
                    </ColHeading>
                    <ColHeading>
                        <Message messageKey='tool.announcementsTime'></Message>
                    </ColHeading>
                </Row>
            </PopupContent>
            <Footer>
                <PrimaryButton type={'close'} onClick={onClose}/>
            </Footer>
        </LocaleProvider>
    </PopupContentContainer>;

    return {
        title,
        content
    };
};

export const showTransferPopup = (state, controller, onClose) => {
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
