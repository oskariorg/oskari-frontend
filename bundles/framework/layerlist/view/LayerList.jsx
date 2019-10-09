
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

        this.filterHandler = new FilterHandler();
        this.groupHandler = new CollapseHandler();
        this.groupHandler.setGroupingMethod(GROUPING_METHODS.GROUP);
        if (showOrganizations) {
            this.organizationHandler = new CollapseHandler();
            this.organizationHandler.setGroupingMethod(GROUPING_METHODS.ORGANIZATION);
        }

        this.addHandlerListeners();

        this.state = {
            showOrganizations,
            locale,
            groupCollapse: this.groupHandler.getState(),
            filter: this.filterHandler.getState()
        };
        if (this.organizationHandler) {
            this.state.organizationCollapse = this.organizationHandler.getState();
        }
    }

    addHandlerListeners () {
        const collapseListener = (tabKey) => {
            let collapseKey = tabKey === TABS.ORGANIZATION ? 'organizationCollapse' : 'groupCollapse';
            return (collapseState) => this.setState((state) => {
                return {
                    ...state,
                    [collapseKey]: collapseState
                };
            });
        };

        this.groupHandler.addStateListener(collapseListener(TABS.GROUP));
        if (this.organizationHandler) {
            this.organizationHandler.addStateListener(collapseListener(TABS.ORGANIZATION));
        }

        const throttleCollapseFilterUpdates = Oskari.util.throttle(this.updateCollapseFilters.bind(this), 1000, { leading: false });

        let previousFilterState = null;
        this.filterHandler.addStateListener((filterState) => {
            const { activeFilterId, searchText } = filterState;
            if (previousFilterState && previousFilterState.searchText !== searchText) {
                // Search text changed, give user some time to type in his search.
                throttleCollapseFilterUpdates(activeFilterId, searchText);
            } else {
                this.updateCollapseFilters(activeFilterId, searchText);
            }
            this.setState((state) => {
                return {
                    ...state,
                    filter: filterState
                };
            });
        });
    }

    updateCollapseFilters (activeFilterId, searchText) {
        this.groupHandler.setFilter(activeFilterId, searchText);
        if (this.organizationHandler) {
            this.organizationHandler.setFilter(activeFilterId, searchText);
        }
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
            <Tabs>
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
