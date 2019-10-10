
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabPane } from 'oskari-ui';
import { LayerFilters } from './LayerList/LayerFilters';
import { FilterService } from './LayerList/LayerFilters/FilterService';
import { LayerCollapse } from './LayerList/LayerCollapse';
import { CollapseService } from './LayerList/LayerCollapse/CollapseService';

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

        this.filterService = new FilterService();
        this.groupService = new CollapseService();
        this.groupService.setGroupingMethod(GROUPING_METHODS.GROUP);
        if (showOrganizations) {
            this.organizationService = new CollapseService();
            this.organizationService.setGroupingMethod(GROUPING_METHODS.ORGANIZATION);
        }

        this.addServiceListeners();

        this.state = {
            showOrganizations,
            locale,
            groupCollapse: this.groupService.getState(),
            filter: this.filterService.getState()
        };
        if (this.organizationService) {
            this.state.organizationCollapse = this.organizationService.getState();
        }
    }

    addServiceListeners () {
        const collapseListener = (tabKey) => {
            let collapseKey = tabKey === TABS.ORGANIZATION ? 'organizationCollapse' : 'groupCollapse';
            return (collapseState) => this.setState((state) => {
                return {
                    ...state,
                    [collapseKey]: collapseState
                };
            });
        };

        this.groupService.addStateListener(collapseListener(TABS.GROUP));
        if (this.organizationService) {
            this.organizationService.addStateListener(collapseListener(TABS.ORGANIZATION));
        }

        const throttleCollapseFilterUpdates = Oskari.util.throttle(this.updateCollapseFilters.bind(this), 1000, { leading: false });

        let previousFilterState = null;
        this.filterService.addStateListener((filterState) => {
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
        this.groupService.setFilter(activeFilterId, searchText);
        if (this.organizationService) {
            this.organizationService.setFilter(activeFilterId, searchText);
        }
    }

    getCollapseState (tabKey) {
        if (tabKey === TABS.GROUP) {
            return this.state.groupCollapse;
        } else if (tabKey === TABS.ORGANIZATION) {
            return this.state.organizationCollapse;
        }
    }

    getCollapseMutator (tabKey) {
        if (tabKey === TABS.GROUP) {
            return this.groupService.getMutator();
        } else if (tabKey === TABS.ORGANIZATION) {
            return this.organizationService.getMutator();
        }
    }

    getAllLayersContent (tabKey) {
        const { filter, locale } = this.state;
        const showAddButton = Oskari.getSandbox().hasHandler('ShowLayerEditorRequest');
        return (
            <React.Fragment>
                <LayerFilters
                    {...filter}
                    mutator={this.filterService.getMutator()}
                    showAddButton={showAddButton}
                    locale={locale.filter} />
                <LayerCollapse
                    {...this.getCollapseState(tabKey)}
                    mutator={this.getCollapseMutator(tabKey)}
                    locale={locale}/>
            </React.Fragment>
        );
    }

    render () {
        const { organization, inspire } = this.state.locale.filter;
        return (
            <Tabs tabPosition='top'>
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
