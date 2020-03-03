import React from 'react';
import PropTypes from 'prop-types';
import { GeneralTabPane } from './GeneralTabPane';
import { VisualizationTabPane } from './VisualizationTabPane';
import { AdditionalTabPane } from './AdditionalTabPane';
import { PermissionsTabPane } from './PermissionsTabPane';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Confirm, Button, Tabs, TabPane, Message } from 'oskari-ui';
import { StyledRoot, StyledAlert, StyledButton } from './styled';

const AdminLayerForm = ({
    controller,
    mapLayerGroups,
    dataProviders,
    versions,
    layer,
    capabilities,
    propertyFields,
    messages = [],
    tab,
    onCancel,
    onDelete,
    onSave,
    getMessage,
    rolesAndPermissionTypes,
    scales
}) => {
    // For returning to add multiple layers from service endpoint
    const hasCapabilitiesFetched = !!Object.keys(capabilities).length;
    return (<StyledRoot>
        { messages.map(({ key, type, args }) =>
            <StyledAlert key={key} type={type} message={
                <Message messageKey={key} messageArgs={args}/>
            }/>
        )}
        <Tabs activeKey={tab} onChange={tabKey => controller.setTab(tabKey)}>
            <TabPane key='general' tab={<Message messageKey='generalTabTitle'/>}>
                <GeneralTabPane
                    layer={layer}
                    propertyFields={propertyFields}
                    controller={controller}
                    dataProviders={dataProviders}
                    mapLayerGroups={mapLayerGroups}
                    versions={versions}
                    capabilities={capabilities} />
            </TabPane>
            <TabPane key='visualization' tab={<Message messageKey='visualizationTabTitle'/>}>
                <VisualizationTabPane
                    layer={layer}
                    capabilities={capabilities}
                    scales={scales}
                    propertyFields={propertyFields}
                    controller={controller}/>
            </TabPane>
            <TabPane key='additional' tab={<Message messageKey='additionalTabTitle'/>}>
                <AdditionalTabPane
                    layer={layer}
                    propertyFields={propertyFields}
                    controller={controller}
                    capabilities={capabilities} />
            </TabPane>
            <TabPane key='permissions' tab={<Message messageKey='permissionsTabTitle'/>}>
                <PermissionsTabPane
                    rolesAndPermissionTypes={rolesAndPermissionTypes}
                    permissions={layer.role_permissions}
                    controller={controller}/>
            </TabPane>
        </Tabs>
        <StyledButton type='primary' onClick={() => onSave()}>
            <Message messageKey={layer.isNew ? 'add' : 'save'}/>
        </StyledButton>
        { !layer.isNew &&
            <React.Fragment>
                <Confirm
                    title={<Message messageKey='messages.confirmDeleteLayer'/>}
                    onConfirm={() => onDelete()}
                    okText={getMessage('ok')}
                    cancelText={getMessage('cancel')}
                    placement='bottomLeft'
                >
                    <StyledButton>
                        <Message messageKey='delete'/>
                    </StyledButton>
                </Confirm>
                { hasCapabilitiesFetched &&
                    <StyledButton onClick={() => controller.addNewFromSameService() }>
                        <Message messageKey='addNewFromSameService'/>
                    </StyledButton>
                }
            </React.Fragment>
        }
        { onCancel &&
            <Button onClick={() => onCancel()}>
                <Message messageKey='close'/>
            </Button>
        }
    </StyledRoot>);
};

AdminLayerForm.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    versions: PropTypes.array.isRequired,
    layer: PropTypes.object.isRequired,
    capabilities: PropTypes.object,
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    messages: PropTypes.array,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    getMessage: PropTypes.func.isRequired,
    rolesAndPermissionTypes: PropTypes.object,
    tab: PropTypes.string.isRequired,
    scales: PropTypes.array.isRequired
};

const contextWrap = LocaleConsumer(AdminLayerForm);
export { contextWrap as AdminLayerForm };
