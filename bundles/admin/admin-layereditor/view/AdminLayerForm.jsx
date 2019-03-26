import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabPane } from '../components/Tabs';
import { Button } from '../components/Button';
import { GeneralTabPane } from './AdminLayerForm/GeneralTabPane';
import { VisualizationTabPane } from './AdminLayerForm/VisualizationTabPane';
import { AdditionalTabPane } from './AdminLayerForm/AdditionalTabPane';
import { PermissionsTabPane } from './AdminLayerForm/PermissionsTabPane';
import { AdminLayerFormService } from './AdminLayerForm/AdminLayerFormService';
import { StyledRoot } from './AdminLayerForm/AdminLayerFormStyledComponents';
import {Alert} from '../components/Alert';
import {GenericContext} from '../../../../src/react/util.jsx';
export class AdminLayerForm extends React.Component {
    constructor ({layer, dataProviders, mapLayerGroups, loc}) {
        super();
        this.service = new AdminLayerFormService(() => this.setState({ layer: this.service.getLayer() }));
        this.service.initLayerState(layer, mapLayerGroups, dataProviders);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit () {
        // TODO handle response
        this.service.saveLayer();
    }

    render () {
        const mutator = this.service.getMutator();
        const layer = this.service.layer || {};
        const message = this.service.message || {};
        return (
            <GenericContext.Consumer>
                {value => {
                    const loc = value.loc;
                    return (
                        <StyledRoot>
                            {message.text &&
                                <Alert message={message.text} type={message.type} />
                            }
                            <Tabs>
                                <TabPane tab={loc('generalTabTitle')} key="general">
                                    <GeneralTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('visualizationTabTitle')} key="visual">
                                    <VisualizationTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('additionalTabTitle')} key="additional">
                                    <AdditionalTabPane layer={layer} service={mutator} />
                                </TabPane>
                                <TabPane tab={loc('permissionsTabTitle')} key="permissions">
                                    <PermissionsTabPane />
                                </TabPane>
                            </Tabs>
                            <Button type='primary' onClick={() => this.handleSubmit()}>{loc('save')}</Button>&nbsp;
                            <Button>{loc('cancel')}</Button>
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
    loc: PropTypes.func
};
