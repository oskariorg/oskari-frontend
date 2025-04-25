import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, Button, Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { InfoIcon } from 'oskari-ui/components/icons';
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

export const PublisherPanel = ({ panels, isEdit, controller, onClose, ...statesById }) => {
    const items = panels
        .filter(({ id }) => statesById[id]?.visible !== false)
        .map(({ id, label, tooltip, handler }) => {
            const Component = handler.getPanelComponent();
            return {
                key: id,
                label,
                extra: tooltip ? <InfoIcon title={tooltip} /> : null,
                children: <Component {...statesById[id]} controller={handler.getController()} />
            };
        });

    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <CollapseWrapper>
                <Collapse defaultActiveKey={[PANEL_GENERAL_INFO_ID]} items={items}/>
            </CollapseWrapper>
            <Actions>
                <SecondaryButton type='cancel' onClick={onClose} />
                { isEdit && (
                    <Button onClick={() => controller.save(true)}>
                        <Message messageKey='BasicView.buttons.saveNew'/>
                    </Button>
                )}
                <Button type='primary' onClick={() => controller.save()}>
                    <Message messageKey={`BasicView.buttons.${isEdit ? 'replace' : 'save'}`} />
                </Button>
            </Actions>
        </LocaleProvider>
    );
};

PublisherPanel.propTypes = {
    panels: PropTypes.array.isRequired,
    isEdit: PropTypes.bool.isRequired,
    controller: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};
