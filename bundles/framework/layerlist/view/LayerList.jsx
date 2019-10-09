
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabPane } from 'oskari-ui';
import { AllLayersTab } from './LayerList/AllLayersTab';
import { StateHandler as CollapseHandler } from './LayerList/LayerCollapse/StateHandler';
import { StateHandler as FilterHandler } from './LayerList/LayerFilters/StateHandler';
// import styled from 'styled-components';

const TABS = {
    ORGANIZATION: 'organizations',
    GROUP: 'groups'
};
const GROUPING_METHODS = {
    ORGANIZATION: 'getOrganizationName',
    GROUP: 'getInspireName'
};

export class LayerList extends React.Component {
    constructor (props) {
        super(props);
        const { locale, showOrganizations } = this.props;

        this.groupHandler = new CollapseHandler();
        this.groupHandler.setGroupingMethod(GROUPING_METHODS.GROUP);

        this.organizationHandler = new CollapseHandler();
        this.organizationHandler.setGroupingMethod(GROUPING_METHODS.ORGANIZATION);

        this.filterHandler = new FilterHandler();

        this.groupHandler.addStateListener((collapseState) => this.setState((state) => {
            return {
                ...state,
                groupCollapse: collapseState
            };
        }));
        this.organizationHandler.addStateListener((collapseState) => this.setState((state) => {
            return {
                ...state,
                organizationCollapse: collapseState
            };
        }));
        this.filterHandler.addStateListener((filterState) => {
            this.groupHandler.setFilter(filterState.activeFilterId, '');
            this.organizationHandler.setFilter(filterState.activeFilterId, '');
            this.setState((state) => {
                return {
                    ...state,
                    filter: filterState
                };
            });
        });

        this.state = {
            showOrganizations,
            locale,
            groupCollapse: this.groupHandler.getState(),
            organizationCollapse: this.organizationHandler.getState(),
            filter: this.filterHandler.getState()
        };
    }

    onTabClick (key) {
        // Do something on filters?
    }

    getAllLayersContent (tabKey) {
        const { filter, locale, organizationCollapse, groupCollapse } = this.state;
        return (
            <AllLayersTab
                collapse = { tabKey === TABS.GROUP ? groupCollapse : organizationCollapse }
                filter = { filter }
                locale = { locale } />);
    }

    render () {
        const { organization, inspire } = this.state.locale.filter;
        return (
            <Tabs onTabClick={(key) => this.onTabClick(key)}>
                <TabPane tab={inspire} key={TABS.GROUP}>
                    { this.getAllLayersContent(TABS.GROUP) }
                </TabPane>

                { this.state.showOrganizations &&
                    <TabPane tab={organization} key={TABS.ORGANIZATION}>
                        { this.getAllLayersContent(TABS.ORGANIZATION) }
                    </TabPane>
                }
                <TabPane tab={'Selected'} key='selected'>
                    Selected layers should be presented here
                </TabPane>
            </Tabs>
        );
    }
}

LayerList.propTypes = {
    showOrganizations: PropTypes.bool,
    locale: PropTypes.object.isRequired
};
