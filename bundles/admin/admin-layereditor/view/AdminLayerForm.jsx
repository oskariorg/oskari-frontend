import React from 'react';
import styled from 'styled-components';
import { Tabs, TabPane } from '../components/Tabs';
import { Button } from '../components/Button';
import { GeneralTabPane } from './GeneralTabPane';
import { VisualizationTabPane } from './VisualizationTabPane';
import { AdditionalTabPane } from './AdditionalTabPane';
import { PermissionsTabPane } from './PermissionsTabPane';

export class AdminLayerForm extends React.Component {
    render () {
        const StyledRoot = styled('div')`
                padding: 5px;
                max-width: 500px;
            `;
        return (
            <StyledRoot>
                <Tabs>
                    <TabPane tab="General" key="general">
                        <GeneralTabPane />
                    </TabPane>
                    <TabPane tab='Visualization' key="visual">
                        <VisualizationTabPane />
                    </TabPane>
                    <TabPane tab='Additional' key="additional">
                        <AdditionalTabPane />
                    </TabPane>
                    <TabPane tab='Permissions' key="permissions">
                        <PermissionsTabPane />
                    </TabPane>
                </Tabs>
                <Button type='primary'>Add</Button>
                <Button>Cancel</Button>
            </StyledRoot>
        );
    }
};
