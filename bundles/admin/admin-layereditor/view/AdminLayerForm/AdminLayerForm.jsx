import React from 'react';
import PropTypes from 'prop-types';
import { GeneralTabPane } from './GeneralTabPane/';
import { VisualizationTabPane } from './VisualizationTabPane/';
import { AdditionalTabPane } from './AdditionalTabPane/';
import { PermissionsTabPane } from './PermissionsTabPane/';
import { StyledRoot } from './StyledFormComponents';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Confirm, Alert, Button, Tabs, Message } from 'oskari-ui';
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
    capabilities,
    propertyFields,
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
            <GeneralTabPane
                layer={layer}
                propertyFields={propertyFields}
                controller={controller}
                dataProviders={dataProviders}
                mapLayerGroups={mapLayerGroups}
                capabilities={capabilities} />
            <VisualizationTabPane
                layer={layer}
                propertyFields={propertyFields}
                controller={controller}/>
            <AdditionalTabPane
                layer={layer}
                propertyFields={propertyFields}
                controller={controller} />
            <PermissionsTabPane
                rolesAndPermissionTypes={rolesAndPermissionTypes}
                permissions={layer.role_permissions}
                controller={controller}/>
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
    controller: PropTypes.instanceOf(Controller).isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    messages: PropTypes.array,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    getMessage: PropTypes.func.isRequired,
    rolesAndPermissionTypes: PropTypes.object
};

const contextWrap = LocaleConsumer(AdminLayerForm);
export { contextWrap as AdminLayerForm };
