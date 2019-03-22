import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabPane } from '../components/Tabs';
import { Button } from '../components/Button';
import { GeneralTabPane } from './GeneralTabPane';
import { VisualizationTabPane } from './VisualizationTabPane';
import { AdditionalTabPane } from './AdditionalTabPane';
import { PermissionsTabPane } from './PermissionsTabPane';
import { AdminLayerFormService } from './AdminLayerFormService';
import { StyledRoot } from './AdminLayerFormStyledComponents';

export class AdminLayerForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
        this.service = new AdminLayerFormService(() => this.setState({ layer: this.service.getLayer() }));
        this.state.layer = this.service.initLayerState(props.layer);
        this.state.dataProviders = [];
        this.state.layerGroups = [];
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        const me = this;
        // TODO this is only for getting dummy content for storybook
        if ((typeof (Oskari) !== 'undefined')) {
            this.service.fetchAsyncData()
                .then(([dataProviders, layerGroups]) => {
                    this.setState({dataProviders: dataProviders.organization, layerGroups: layerGroups.groups});
                    me.service.getMutator().setAllMapLayerGroups(layerGroups.groups);
                });
        } else {
            this.setState({dataProviders: this.service.getDummyDataProviders(), layerGroups: this.service.getDummyLayerGroups()});
        }
    };

    handleSubmit () {
        // TODO handle response
        this.service.saveLayer();
    }

    render () {
        const generalProps = {
            dataProviders: this.state.dataProviders,
            layerGroups: this.state.layerGroups,
            mapLayerGroups: this.state.layerGroups
        };
        const mutator = this.service.getMutator();
        const layer = this.service.layer || {};
        return (
            <StyledRoot>
                <Tabs>
                    <TabPane tab="General" key="general">
                        <GeneralTabPane layer={layer} service={mutator} generalProps={generalProps} />
                    </TabPane>
                    <TabPane tab='Visualization' key="visual">
                        <VisualizationTabPane layer={layer} service={mutator} />
                    </TabPane>
                    <TabPane tab='Additional' key="additional">
                        <AdditionalTabPane layer={layer} service={mutator} />
                    </TabPane>
                    <TabPane tab='Permissions' key="permissions">
                        <PermissionsTabPane />
                    </TabPane>
                </Tabs>
                <Button type='primary' onClick={() => this.handleSubmit()}>Save</Button>&nbsp;
                <Button>Cancel</Button>
            </StyledRoot>
        );
    }
}

AdminLayerForm.propTypes = {
    layer: PropTypes.object
};
