import React from 'react';
import PropTypes from 'prop-types';
import { GeneralTabPane } from './AdminLayerForm/GeneralTabPane';
import { VisualizationTabPane } from './AdminLayerForm/VisualizationTabPane';
import { AdditionalTabPane } from './AdminLayerForm/AdditionalTabPane';
import { PermissionsTabPane } from './AdminLayerForm/PermissionsTabPane';
import { StyledRoot } from './AdminLayerForm/StyledFormComponents';
import { LocaleConsumer } from 'oskari-ui/util';
import { Confirm, Alert, Button, Tabs, TabPane, Message } from 'oskari-ui';
import styled from 'styled-components';

const PaddedButton = styled(Button)`
    margin-right: 5px;
`;

const PaddedAlert = styled(Alert)`
    margin-bottom: 5px;
`;
const AdminLayerForm = ({
    controller,
    mapLayerGroups,
    dataProviders,
    layer,
    messages = [],
    onCancel,
    onDelete,
    onSave,
    getMessage,
    rolesAndPermissionTypes
}) => (
    <StyledRoot>
        { messages.map(({ key, type }) => <PaddedAlert key={key} message={<Message messageKey={key} />} type={type} />) }
        <Tabs>
            <TabPane key='general' tab={<Message messageKey='generalTabTitle'/>}>
                <GeneralTabPane dataProviders={dataProviders} mapLayerGroups={mapLayerGroups} layer={layer} controller={controller} />
            </TabPane>
            <TabPane key='visual' tab={<Message messageKey='visualizationTabTitle'/>}>
                <VisualizationTabPane layer={layer} controller={controller} />
            </TabPane>
            <TabPane key='additional' tab={<Message messageKey='additionalTabTitle'/>}>
                <AdditionalTabPane layer={layer} controller={controller} />
            </TabPane>
            <TabPane key='permissions' tab={<Message messageKey='permissionsTabTitle'/>}>
                <PermissionsTabPane
                    rolesAndPermissionTypes={rolesAndPermissionTypes}
                    permissions={layer.role_permissions} />
            </TabPane>
        </Tabs>
        <PaddedButton type='primary' onClick={() => onSave()}>
            <Message messageKey={layer.isNew ? 'add' : 'save'}/>
        </PaddedButton>
        { !layer.isNew &&
            <Confirm
                title={<Message messageKey='messages.confirmDeleteLayer'/>}
                onConfirm={() => onDelete()}
                okText={getMessage('ok')}
                cancelText={getMessage('cancel')}
                placement='bottomLeft'
            >
                <PaddedButton>
                    <Message messageKey='delete'/>
                </PaddedButton>
            </Confirm>
        }
        { onCancel &&
            <Button onClick={() => onCancel()}>
                <Message messageKey='cancel'/>
            </Button>
        }
    </StyledRoot>
);

AdminLayerForm.propTypes = {
    controller: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    layer: PropTypes.object.isRequired,
    messages: PropTypes.array,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    getMessage: PropTypes.func.isRequired,
    rolesAndPermissionTypes: PropTypes.object
};

const contextWrap = LocaleConsumer(AdminLayerForm);
export { contextWrap as AdminLayerForm };
