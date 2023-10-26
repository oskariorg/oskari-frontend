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


const SearchFlyout = ({ state, controller }) => {
    const Component = (
        <Content>
            {state.indicators?.length < 1 && (
                <Message messageKey='statsgrid.noIndicators' />
            )}
            <Field>
                <b><Message messageKey='panels.newSearch.seriesTitle' /></b>
                <Checkbox
                    checked={state.searchTimeseries}
                    onChange={(e) => controller.setSearchTimeseries(e.target.checked)}
                >
                    <Message messageKey='panels.newSearch.seriesLabel' />
                </Checkbox>
            </Field>
            <Field>
                <b><Message messageKey='panels.newSearch.regionsetTitle' /></b>
                <StyledSelect
                    mode='multiple'
                    filterOption={false}
                    options={state?.regionsetOptions?.map(rs => ({ value: rs.id, label: rs.name }))}
                    placeholder={<Message messageKey='panels.newSearch.selectRegionsetPlaceholder' />}
                    value={state?.selectedRegionsets}
                    onChange={(value) => controller.setSelectedRegionsets(value)}
                />
            </Field>
            <Field>
                <b><Message messageKey='panels.newSearch.datasourceTitle' /></b>
                <StyledSelect
                    options={state?.datasourceOptions?.map(ds => ({ value: ds.id, label: ds.name, disabled: state.disabledDatasources.includes(ds.id) }))}
                    placeholder={<Message messageKey='panels.newSearch.selectDatasourcePlaceholder' />}
                    value={state?.selectedDatasource}
                    onChange={(value) => controller.setSelectedDatasource(value)}
                />
            </Field>
            <Field>
                <Row>
                    <IndicatorField>
                        <b><Message messageKey='panels.newSearch.indicatorTitle' /></b>
                        <StyledSelect
                            mode='multiple'
                            options={state?.indicatorOptions?.map(i => ({ value: i.id, label: i.title, disabled: state.disabledIndicators.includes(i.id) }))}
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
                            {state.selectedIndicators?.length === 1 ? (
                                <Message messageKey='userIndicators.modify.edit' />
                            ) : (
                                <Message messageKey='userIndicators.buttonTitle' />
                            )}
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
                    state={state}
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
            <IndicatorCollapse state={state} controller={controller} />
        </Content>
    );

    if (state.loading) {
        return <Spin showTip={true}>{Component}</Spin>;
    }
    return Component;
};

export const showSearchFlyout = (state, controller, onClose) => {

    const title = <Message bundleKey={BUNDLE_KEY} messageKey='tile.search' />;
    const controls = showFlyout(
        title,
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <SearchFlyout state={state} controller={controller} />
        </LocaleProvider>,
        onClose
    );

    return {
        ...controls,
        update: (state) => controls.update(
            title,
            <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                <SearchFlyout state={state} controller={controller} />
            </LocaleProvider>
        )
    }
}
