import React from 'react';
import PropTypes from 'prop-types';
import { GeneralTabPane } from './AdminLayerForm/GeneralTabPane';
import { VisualizationTabPane } from './AdminLayerForm/VisualizationTabPane';
import { AdditionalTabPane } from './AdminLayerForm/AdditionalTabPane';
import { PermissionsTabPane } from './AdminLayerForm/PermissionsTabPane';
import { StyledRoot } from './AdminLayerForm/StyledFormComponents';
import { withLocale, withMutator } from 'oskari-ui/util';
import { Confirm, Alert, Button, Tabs, TabPane } from 'oskari-ui';
import styled from 'styled-components';

const PaddedButton = styled(Button)`
    margin-right: 5px;
`;

const PaddedAlert = styled(Alert)`
    margin-bottom: 5px;
`;
const AdminLayerForm = ({
    mutator,
    mapLayerGroups,
    dataProviders,
    layer,
    messages = [],
    onCancel,
    onDelete,
    onSave,
    getMessage
}) => {
    const mappedMessages = [];
    messages.forEach(m => {
        if (m.key) {
            m.text = getMessage(m.key);
        }
        if (m.text) {
            mappedMessages.push(<PaddedAlert key={m.key} message={m.text} type={m.type} />);
        }
    });
    return (
        <StyledRoot>
            { mappedMessages }
            <Tabs>
                <TabPane tab={getMessage('generalTabTitle')} key='general'>
                    <GeneralTabPane
                        dataProviders={dataProviders}
                        mapLayerGroups={mapLayerGroups}
                        layer={layer}
                        service={mutator} />
                </TabPane>
                <TabPane tab={getMessage('visualizationTabTitle')} key='visual'>
                    <VisualizationTabPane layer={layer} service={mutator} />
                </TabPane>
                <TabPane tab={getMessage('additionalTabTitle')} key='additional'>
                    <AdditionalTabPane layer={layer} service={mutator} />
                </TabPane>
                <TabPane tab={getMessage('permissionsTabTitle')} key='permissions'>
                    <PermissionsTabPane />
                </TabPane>
            </Tabs>
            <PaddedButton type='primary' onClick={() => onSave()}>
                { layer.isNew &&
                    getMessage('add')
                }
                { !layer.isNew &&
                    getMessage('save')
                }
            </PaddedButton>
            { !layer.isNew &&
                <Confirm title={getMessage('messages.confirmDeleteLayer')} onConfirm={() => onDelete()}
                    okText={getMessage('ok')} cancelText={getMessage('cancel')} placement='bottomLeft'>
                    <PaddedButton>{getMessage('delete')}</PaddedButton>
                </Confirm>
            }
            { onCancel &&
                <Button onClick={() => onCancel()}>{getMessage('cancel')}</Button>
            }
        </StyledRoot>
    );
};

AdminLayerForm.propTypes = {
    mutator: PropTypes.object.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    dataProviders: PropTypes.array.isRequired,
    layer: PropTypes.object.isRequired,
    messages: PropTypes.array,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = withMutator(withLocale(AdminLayerForm));
export { contextWrap as AdminLayerForm };
