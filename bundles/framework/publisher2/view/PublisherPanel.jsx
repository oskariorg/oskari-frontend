import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, Button, Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { PANEL_GENERAL_INFO_ID } from '../handler/PublisherSidebarHandler';
import { BUNDLE_KEY } from '../constants';

const CollapseWrapper = styled('div')`
    margin: 0.25em;
    overflow-y: auto;
`;
const Actions = styled(ButtonContainer)`
    padding-right: 15px;
`;

export const PublisherPanel = ({ collapseItems, uuid, controller, onClose }) => {
    // Don't render empty panels
    const items = collapseItems.filter(item => item.children);
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <CollapseWrapper>
                <Collapse defaultActiveKey={[PANEL_GENERAL_INFO_ID]} items={items}/>;
            </CollapseWrapper>
            <Actions>
                <SecondaryButton type='cancel' onClick={onClose} />
                { !!uuid && (
                    <Button onClick={() => controller.save(true)}>
                        <Message messageKey='BasicView.buttons.saveNew'/>
                    </Button>
                )}
                <Button type='primary' onClick={() => controller.save()}>
                    <Message messageKey={`BasicView.buttons.${uuid ? 'replace' : 'save'}`} />
                </Button>
            </Actions>
        </LocaleProvider>
    );
};

PublisherPanel.propTypes = {
    collapseItems: PropTypes.array.isRequired,
    uuid: PropTypes.string,
    controller: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};
