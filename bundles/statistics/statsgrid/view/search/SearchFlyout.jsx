import React from 'react';
import { Checkbox, Select, Message, Spin, Button } from 'oskari-ui';
import { showFlyout } from 'oskari-ui/components/window';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { LocaleProvider } from 'oskari-ui/util';
import { IndicatorParams } from './IndicatorParams';
import { IndicatorCollapse } from './IndicatorCollapse';

const BUNDLE_KEY = 'StatsGrid';
const Content = styled('div')`
    max-width: 500px;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;
const StyledSelect = styled(Select)`
    width: 100%;
`;
const Field = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;
const Row = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: end;
`;
const AddIndicatorBtn = styled(Button)`
    max-width: 40%;
`;
const IndicatorField = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-right: 10px;
`;

// For preventing checkbox clickable area from stretching to 100% of content width
const ClickableArea = ({ children }) => <div>{children}</div>;

const SearchFlyout = ({ regionsets = [], datasources = [], state, controller }) => {
    if (!datasources.length || !regionsets.length) {
        // Nothing to show -> show generic "data missing" message
        return (<b><Message messageKey='errors.indicatorListError' /></b>);
    }
    const singleIndicatorSelected = state.selectedIndicators?.length === 1;
    const multipleRegionsetsAvailable = regionsets.length > 1;
    const multipleDatasourcesAvailable = datasources.length > 1;
    if (!multipleDatasourcesAvailable && !state?.selectedDatasource) {
        // only one datasource and it is NOT selected -> select it mid-render
        // Note! not the best place to have this here, but there is quite a bit of combinations where this needs to be defaulted
        // depending if regionset filter is changed / reset button is clicked etc
        controller.setSelectedDatasource(datasources[0].id);
    }
    const Component = (
        <React.Fragment>
            <Field>
                <b><Message messageKey='panels.newSearch.seriesTitle' /></b>
                <ClickableArea>
                    <Checkbox
                        checked={state.searchTimeseries}
                        onChange={(e) => controller.setSearchTimeseries(e.target.checked)}
                    >
                        <Message messageKey='panels.newSearch.seriesLabel' />
                    </Checkbox>
                </ClickableArea>
            </Field>
            { multipleRegionsetsAvailable &&
                <Field>
                    <b><Message messageKey='panels.newSearch.regionsetTitle' /></b>
                    <StyledSelect
                        mode='multiple'
                        optionFilterProp='label'
                        options={regionsets.map(rs => ({ value: rs.id, label: rs.name }))}
                        placeholder={<Message messageKey='panels.newSearch.selectRegionsetPlaceholder' />}
                        value={state?.regionsetFilter}
                        onChange={(value) => controller.setRegionsetFilter(value)}
                    />
                </Field>
            }
            { multipleDatasourcesAvailable &&
                <Field>
                    <b><Message messageKey='panels.newSearch.datasourceTitle' /></b>
                    <StyledSelect
                        options={datasources.map(ds => ({ value: ds.id, label: ds.name, disabled: state.disabledDatasources.includes(ds.id) }))}
                        placeholder={<Message messageKey='panels.newSearch.selectDatasourcePlaceholder' />}
                        value={state?.selectedDatasource}
                        onChange={(value) => controller.setSelectedDatasource(value)}
                    />
                </Field>
            }
            <Field>
                <Row>
                    <IndicatorField>
                        <b><Message messageKey='panels.newSearch.indicatorTitle' /></b>
                        <StyledSelect
                            mode='multiple'
                            optionFilterProp='label'
                            options={state?.indicatorOptions?.map(i => ({ value: i.id, label: i.title, disabled: !!i.disabled }))}
                            placeholder={<Message messageKey='panels.newSearch.selectIndicatorPlaceholder' />}
                            disabled={!state?.indicatorOptions || state?.indicatorOptions?.length < 1}
                            value={state?.selectedIndicators}
                            onChange={(value) => controller.setSelectedIndicators(value)}
                        />
                    </IndicatorField>
                    {state.isUserDatasource && (
                        <AddIndicatorBtn
                            onClick={() => controller.showIndicatorForm()}
                        >
                            { !singleIndicatorSelected && (<Message messageKey='userIndicators.buttonTitle' />) }
                            { singleIndicatorSelected && (<Message messageKey='userIndicators.modify.edit' />) }
                        </AddIndicatorBtn>
                    )}
                </Row>
            </Field>
            {state.selectedIndicators && state.selectedIndicators.length > 0 && (
                <div>
                    <a onClick={() => controller.openMetadataPopup()}>
                        <Message messageKey='metadataPopup.open' messageArgs={{ indicators: state.selectedIndicators.length }} />
                    </a>
                </div>
            )}
            <b><Message messageKey='panels.newSearch.refineSearchLabel' /></b>
            {!state.indicatorParams && (
                <i><Message messageKey='panels.newSearch.refineSearchTooltip1' /></i>
            )}
            {state.indicatorParams && (
                <IndicatorParams
                    allRegionsets={regionsets}
                    params={state.indicatorParams}
                    searchTimeseries={state.searchTimeseries}
                    controller={controller}
                />
            )}
            <ButtonContainer>
                <SecondaryButton
                    type='clear'
                    onClick={() => controller.clearSearch()}
                />
                <PrimaryButton
                    type='search'
                    disabled={state.selectedIndicators?.length < 1}
                    onClick={() => controller.search()}
                />
            </ButtonContainer>
        </React.Fragment>
    );

    if (state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

export const showSearchFlyout = (regionsets = [], datasources = [], indicators = [], state, controller, onClose) => {
    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.search' />;
    const controls = showFlyout(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                {!indicators.length && (<Message messageKey='statsgrid.noIndicators' />)}
                <SearchFlyout regionsets={regionsets} datasources={datasources} state={state} controller={controller} />
                <IndicatorCollapse indicators={indicators} controller={controller} />
            </Content>
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state, indicators = []) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <Content>
                    {!indicators.length && (<Message messageKey='statsgrid.noIndicators' />)}
                    <SearchFlyout regionsets={regionsets} datasources={datasources} state={state} controller={controller} />
                    <IndicatorCollapse indicators={indicators} controller={controller} />
                </Content>
            </LocaleProvider>
        )
    };
};
