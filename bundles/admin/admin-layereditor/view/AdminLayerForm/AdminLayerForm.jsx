import React from 'react';
import PropTypes from 'prop-types';
import { GeneralTabPane } from './GeneralTabPane';
import { VisualizationTabPane } from './VisualizationTabPane';
import { AdditionalTabPane } from './AdditionalTabPane';
import { PermissionsTabPane } from './PermissionsTabPane';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { Confirm, Button, Tabs, TabPane, Message, Tooltip } from 'oskari-ui';
import { StyledRoot, StyledAlert, StyledButton } from './styled';
import { Mandatory, MandatoryIcon } from './Mandatory';

const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

const getValidationMessage = (validationErrorMessages = []) => {
    return (<div>
        <Message messageKey={'validation.mandatoryMsg'} />
        <ul>{ validationErrorMessages
            .map(field => <li key={field}><Message messageKey={`fields.${field}`}/></li>)}
        </ul>
    </div>);
};

const SaveButton = ({ isNew, onSave, validationErrors = [] }) => {
    const label = (<Message messageKey={isNew ? 'add' : 'save'}/>);
    if (validationErrors.length > 0) {
        return (
            <Tooltip title={getValidationMessage(validationErrors)}>
                <StyledButton type='dashed'>{label}</StyledButton>
            </Tooltip>
        );
    }
    return (<StyledButton type='primary' onClick={() => onSave()}>{label}</StyledButton>);
};

SaveButton.propTypes = {
    isNew: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    validationErrors: PropTypes.array
};
const MemoedSaveButton = React.memo(SaveButton);

const AdminLayerForm = ({
    controller,
    mapLayerGroups,
    dataProviders,
    versions,
    layer,
    propertyFields,
    tab,
    onCancel,
    onDelete,
    onSave,
    getMessage,
    rolesAndPermissionTypes,
    validators = {},
    validationErrors = [],
    scales
}) => {
    const isLayerTypeSupported = propertyFields.length > 0;
    // For returning to add multiple layers from service endpoint
    const hasCapabilitiesSupport = propertyFields.includes(LayerComposingModel.CAPABILITIES);
    let validPermissions = true;
    const permissionValidator = validators['role_permissions'];
    if (typeof permissionValidator === 'function') {
        validPermissions = permissionValidator(layer);
    }
    return (<StyledRoot>
        <Tabs activeKey={tab} onChange={tabKey => controller.setTab(tabKey)}>
            <TabPane key='general' tab={<Message messageKey='generalTabTitle'/>}>
                <GeneralTabPane
                    layer={layer}
                    propertyFields={propertyFields}
                    controller={controller}
                    dataProviders={dataProviders}
                    mapLayerGroups={mapLayerGroups}
                    versions={versions}
                    validators={validators} />
            </TabPane>
            <TabPane key='visualization' tab={<Message messageKey='visualizationTabTitle'/>}>
                <VisualizationTabPane
                    layer={layer}
                    scales={scales}
                    propertyFields={propertyFields}
                    controller={controller}/>
            </TabPane>
            <TabPane key='additional' tab={<Message messageKey='additionalTabTitle'/>}>
                <AdditionalTabPane
                    layer={layer}
                    propertyFields={propertyFields}
                    controller={controller} />
            </TabPane>
            <TabPane key='permissions' tab={<Mandatory isValid={validPermissions}><Message messageKey='permissionsTabTitle'/>&nbsp;<MandatoryIcon /></Mandatory>}>
                <PermissionsTabPane
                    rolesAndPermissionTypes={rolesAndPermissionTypes}
                    permissions={layer.role_permissions}
                    controller={controller}/>
            </TabPane>
        </Tabs>
        { isLayerTypeSupported && <MemoedSaveButton isNew={!!layer.isNew} onSave={onSave} validationErrors={validationErrors} /> }
        { !layer.isNew &&
            <React.Fragment>
                <Confirm
                    title={<Message messageKey='messages.confirmDeleteLayer'/>}
                    onConfirm={() => onDelete()}
                    okText={getMessage('ok')}
                    cancelText={getMessage('cancel')}
                    placement='bottomLeft'
                >
                    <span>
                        <StyledButton>
                            <Message messageKey='delete'/>
                        </StyledButton>
                    </span>
                </Confirm>
                { hasCapabilitiesSupport &&
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
    propertyFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    getMessage: PropTypes.func.isRequired,
    rolesAndPermissionTypes: PropTypes.object,
    validators: PropTypes.object,
    validationErrors: PropTypes.arrayOf(PropTypes.string),
    tab: PropTypes.string.isRequired,
    scales: PropTypes.array.isRequired
};

const contextWrap = LocaleConsumer(AdminLayerForm);
export { contextWrap as AdminLayerForm };
