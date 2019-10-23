
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabPane, Spin } from 'oskari-ui';
import { handleBinder } from 'oskari-ui/util';
import { LayerFilters, FilterService } from './LayerFilters/';
import { LayerCollapse, CollapseService, GROUPING_METHODS } from './LayerCollapse/';
import { LayerListAlert } from '.';
import styled from 'styled-components';

const GROUPED_LAYERS_TABS = {
    ORGANIZATION: 'organizations',
    GROUP: 'groups'
};
const TAB_CHANGE_ANIMATION_TIMEOUT = 500;
const TEXT_SEARCH_THROTTLE = 1000;

const StyledTabs = styled(Tabs)`
    max-width: 600px;
`;

export class LayerList extends React.Component {
    constructor (props) {
        super(props);
        this.instance = this.props.instance;
        this.locale = this.instance.getLocalization();
        this.selectedTab = GROUPED_LAYERS_TABS.GROUP;
        this.layerGroupings = {};

        Object.keys(GROUPED_LAYERS_TABS).forEach(key => {
            const tabKey = GROUPED_LAYERS_TABS[key];
            this.layerGroupings[tabKey] = {
                key,
                searchFieldRef: React.createRef(),
                service: null
            };
        });

        this.initFilteringServices();

        this.state = {
            loading: true
        };
        this.loadLayers();
        handleBinder(this);
    }

    loadLayers () {
        const mapLayerService = this.instance.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        const successCB = () => {
            this.initLayerGroupServices();
            this.setState(state => ({ ...state, loading: false }));
        };
        const failureCB = () => {
            this.setState(state => ({
                ...state,
                error: this.locale.errors.loadFailed,
                loading: false
            }));
            alert(this.locale.errors.loadFailed);
        };
        const forceProxy = this.instance.conf && this.instance.conf.forceProxy;
        mapLayerService.loadAllLayerGroupsAjax(successCB, failureCB, { forceProxy });
    }

    initLayerGroupServices () {
        if (!this.props.showOrganizations) {
            delete this.layerGroupings[GROUPED_LAYERS_TABS.ORGANIZATION];
        }
        const changes = {};
        Object.keys(this.layerGroupings).forEach(tabKey => {
            const grouping = this.layerGroupings[tabKey];
            const service = new CollapseService(this.instance);
            service.setGroupingMethod(GROUPING_METHODS[grouping.key]);
            service.addStateListener(groupState => this.setState(state => ({
                ...state,
                [tabKey]: groupState
            })));
            changes[tabKey] = service.getState();
            grouping.service = service;
        });
        this.setState(state => ({ ...state, ...changes }));
    }

    initFilteringServices () {
        this.filterService = new FilterService(this.instance);

        const updateLayerFilters = (activeFilterId, searchText) => {
            Object.values(this.layerGroupings).forEach(grouping => {
                if (grouping.service) {
                    grouping.service.setFilter(activeFilterId, searchText);
                }
            });
        };
        const throttledLayerFilterUpdate = Oskari.util.throttle(
            updateLayerFilters, TEXT_SEARCH_THROTTLE, { leading: false });

        let previousFilterState = null;
        this.filterService.addStateListener(filterState => {
            const { activeFilterId, searchText } = filterState;
            if (previousFilterState && previousFilterState.searchText !== searchText) {
                // Search text changed, give user some time to type in his search.
                throttledLayerFilterUpdate(activeFilterId, searchText);
            } else {
                updateLayerFilters(activeFilterId, searchText);
            }
            this.focusOnSearchField();
            this.setState(state => ({
                ...state,
                filter: filterState
            }));
        });
    }

    getGroupedLayers (tab) {
        const showAddButton = Oskari.getSandbox().hasHandler('ShowLayerEditorRequest');
        const ref = this.layerGroupings[tab].searchFieldRef;
        const layerGroupingMutator = this.layerGroupings[tab].service.getMutator();
        return (
            <React.Fragment>
                <LayerFilters
                    {...this.state.filter}
                    showAddButton={showAddButton}
                    ref={ref}
                    mutator={this.filterService.getMutator()}
                    locale={this.locale.filter} />
                <LayerCollapse
                    {...this.state[tab]}
                    mutator={layerGroupingMutator}
                    locale={this.locale}/>
            </React.Fragment>
        );
    }

    focusOnSearchField (tab = this.selectedTab) {
        this.selectedTab = tab;
        if (!this.layerGroupings[tab]) {
            return;
        }
        const ref = this.layerGroupings[tab].searchFieldRef;
        if (!ref || !ref.current) {
            return;
        }
        const input = ref.current.querySelector('input:first-of-type');
        if (input) {
            input.focus();
        }
    }

    handleTabChange (tab) {
        // Wait until the input is visible
        setTimeout(() => this.focusOnSearchField(tab), TAB_CHANGE_ANIMATION_TIMEOUT);
    }

    render () {
        const { organization, inspire } = this.locale.filter;
        if (this.state.error) {
            return <LayerListAlert showIcon type="error" description={this.state.error}/>;
        }
        if (this.state.loading) {
            return <Spin />;
        }
        const orgKey = GROUPED_LAYERS_TABS.ORGANIZATION;
        const groupKey = GROUPED_LAYERS_TABS.GROUP;
        return (
            <StyledTabs tabPosition='top' onChange={this.handleTabChange}>
                <TabPane tab={inspire} key={groupKey}>
                    { this.getGroupedLayers(groupKey) }
                </TabPane>

                { this.props.showOrganizations &&
                    <TabPane tab={organization} key={orgKey}>
                        { this.getGroupedLayers(orgKey) }
                    </TabPane>
                }
            </StyledTabs>
        );
    }
}

LayerList.propTypes = {
    showOrganizations: PropTypes.bool,
    instance: PropTypes.object.isRequired
};
