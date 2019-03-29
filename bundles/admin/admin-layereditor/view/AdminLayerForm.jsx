import React from 'react';
import PropTypes from 'prop-types';
import {Tabs, TabPane} from '../components/Tabs';
import {Button} from '../components/Button';
import {GeneralTabPane} from './AdminLayerForm/GeneralTabPane';
import {VisualizationTabPane} from './AdminLayerForm/VisualizationTabPane';
import {AdditionalTabPane} from './AdminLayerForm/AdditionalTabPane';
import {PermissionsTabPane} from './AdminLayerForm/PermissionsTabPane';
import {AdminLayerFormService} from './AdminLayerForm/AdminLayerFormService';
import {StyledRoot} from './AdminLayerForm/AdminLayerFormStyledComponents';
import {Alert} from '../components/Alert';
import {GenericContext} from '../../../../src/react/util.jsx';
import {Confirm} from '../components/Confirm';

export class AdminLayerForm extends React.Component {
    constructor ({layer, dataProviders, mapLayerGroups, flyout}) {
        super();
        this.flyout = flyout;
        this.service = new AdminLayerFormService(() => this.setState({ layer: this.service.getLayer() }));
        this.service.initLayerState(layer, mapLayerGroups, dataProviders);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.deleteLayer = this.deleteLayer.bind(this);
    }

    handleSubmit () {
        this.service.saveLayer();
    }

    handleCancel () {
        this.flyout.hide();
    }

    deleteLayer () {
        this.service.deleteLayer();
    }
    render () {
        const mutator = this.service.getMutator();
        const layer = this.service.layer || {};
        const message = this.service.message || {};
        return (
            <GenericContext.Consumer>
                {value => {
                    const loc = value.loc;
                    if (message.key) {
                        message.text = loc(message.key);
                    }
                    return (
                        <StyledRoot>
                            {message.text &&
                                <Alert message={message.text} type={message.type} />
                            }
                            <Tabs>
                                <TabPane tab={loc('generalTabTitle')} key='general'>
                                    <GeneralTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('visualizationTabTitle')} key='visual'>
                                    <VisualizationTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('additionalTabTitle')} key='additional'>
                                    <AdditionalTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('permissionsTabTitle')} key='permissions'>
                                    <PermissionsTabPane />
                                </TabPane>
                            </Tabs>
                            <Button type='primary' onClick={() => this.handleSubmit()}>
                                {layer.isNew &&
                                    loc('add')
                                }
                                {!layer.isNew &&
                                    loc('save')
                                }
                            </Button>&nbsp;
                            {!layer.isNew &&
                                <Confirm title={loc('messages.confirmDeleteLayer')} onConfirm={() => this.deleteLayer()}
                                    okText={loc('ok')} cancelText={loc('cancel')} placement='bottomLeft'>
                                    <Button>{loc('delete')}</Button>&nbsp;
                                </Confirm>
                            }
                            {this.flyout &&
                                <Button onClick={() => this.handleCancel()}>{loc('cancel')}</Button>
                            }
                        </StyledRoot>
                    );
                }}
            </GenericContext.Consumer>
        );
    }
}

AdminLayerForm.propTypes = {
    layer: PropTypes.object,
    dataProviders: PropTypes.array.isRequired,
    mapLayerGroups: PropTypes.array.isRequired,
    flyout: PropTypes.object
};
