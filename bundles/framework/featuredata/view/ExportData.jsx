import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Message, Radio, Checkbox } from 'oskari-ui';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { FEATUREDATA_BUNDLE_ID } from './FeatureDataContainer';
import styled from 'styled-components';

const FlexRow = styled('div')`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-bottom: 1em;
`;

const FlexRowCentered = styled(FlexRow)`
    justify-content: center;
    .ant-btn.ant-btn-primary {
        margin-left: 1em;
    }
`;
const FlexCol = styled('div')`
    display: flex;
    flex-direction: column;
`;

const FlexColRight = styled(FlexCol)`
    margin-left: auto;
`;

const FlexTableContainer = styled('div')`
    padding: 1em;
`;

const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const RadioOption = styled(Radio.Choice)`
`;

const ColumnHeader = styled('h3')`
    margin-bottom: 0;
    padding-bottom: 0.25em;
`;

export const SEPARATORS = {
    semicolon: ';',
    comma: ',',
    tabulator: 'tab'
};

export const FILETYPES = {
    excel: 'XLSX',
    csv: 'CSV'
};

export const COLUMN_SELECTION = {
    all: 'all',
    opened: 'visible'
};

const PARAM_NAMES = {
    format: 'format',
    columns: 'columns',
    delimiter: 'delimiter'
};
const ExportDataPopup = (props) => {
    const { selectedFeatureIds, metadataLink, closeExportDataPopup, sendExportDataForm } = props;
    const [delimiter, setDelimiter] = useState(SEPARATORS.comma);
    const [format, setFormat] = useState(FILETYPES.excel);
    const [columns, setColumns] = useState(COLUMN_SELECTION.opened);
    const [exportDataSource, setExportDataSource] = useState(true);
    const [exportMetadataLink, setExportMetadataLink] = useState(false);
    const [exportOnlySelected, setExportOnlySelected] = useState(false);
    return <>
        <FlexTableContainer>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.title'}/></ColumnHeader>
                    <RadioGroup name={PARAM_NAMES.format} value={format} onChange={(event) => setFormat(event.target.value)}>
                        <RadioOption value={FILETYPES.excel}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.excel'}/>
                        </RadioOption>
                        <RadioOption value={FILETYPES.csv}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.csv'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexCol>
                <FlexColRight>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.title'}/></ColumnHeader>
                    <RadioGroup name={PARAM_NAMES.columns} value={columns} onChange={(event) => setColumns(event.target.value)}>
                        <RadioOption value={COLUMN_SELECTION.opened}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.opened'}/>
                        </RadioOption>
                        <RadioOption value={COLUMN_SELECTION.all}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.all'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexColRight>
            </FlexRow>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.title'}/></ColumnHeader>
                    <RadioGroup name={PARAM_NAMES.delimiter} disabled={format === FILETYPES.excel} value={delimiter} onChange={(event) => setDelimiter(event.target.value)}>
                        <RadioOption value={SEPARATORS.comma}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.comma'}/>
                        </RadioOption>
                        <RadioOption value={SEPARATORS.semicolon}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.semicolon'}/>
                        </RadioOption>
                        <RadioOption value={SEPARATORS.tabulator}>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.tabulator'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexCol>
            </FlexRow>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.title'}/></ColumnHeader>
                    <Checkbox checked={exportDataSource} onChange={(evt) => setExportDataSource(evt.target.checked) }>
                        <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.dataSource'}/>
                    </Checkbox>
                    <Checkbox disabled={!metadataLink} checked={exportMetadataLink} onChange={(evt) => setExportMetadataLink(evt.target.checked)}>
                        <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.metadataLink'}/>
                    </Checkbox>
                    <Checkbox disabled={!selectedFeatureIds?.length > 0} checked={exportOnlySelected} onChange={(evt) => setExportOnlySelected(evt.target.checked)}>
                        <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.onlySelected'}/>
                    </Checkbox>
                </FlexCol>
            </FlexRow>
            <FlexRowCentered>
                <SecondaryButton type='cancel' onClick={closeExportDataPopup}/>
                <Button type='primary' onClick={() => {
                    const formState = {
                        delimiter,
                        format,
                        columns,
                        exportDataSource,
                        exportMetadataLink,
                        exportOnlySelected
                    };
                    sendExportDataForm(formState);
                }}><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.exportButtonLabel'}/></Button>
            </FlexRowCentered>
        </FlexTableContainer>
    </>;
};

ExportDataPopup.propTypes = {
    metadataLink: PropTypes.string,
    selectedFeatureIds: PropTypes.array,
    closeExportDataPopup: PropTypes.func,
    sendExportDataForm: PropTypes.func
};

export const showExportDataPopup = (state, controller) => {
    const { selectedFeatureIds, layers, activeLayerId } = state;
    const activeLayer = layers?.find(layer => layer.getId() === activeLayerId);
    const content = <ExportDataPopup
        selectedFeatureIds={selectedFeatureIds}
        metadataLink={activeLayer.getMetadataIdentifier()}
        closeExportDataPopup={controller.closeExportDataPopup}
        sendExportDataForm={controller.sendExportDataForm}
    />;
    const title = <><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.title'}/></>;
    const controls = showPopup(title, content, () => { controller.closeExportDataPopup(); }, {});

    return {
        ...controls,
        update: (state) => {
            const { selectedFeatureIds, layers, activeLayerId } = state;
            const activeLayer = layers?.find(layer => layer.getId() === activeLayerId);
            controls.update(title,
                <ExportDataPopup
                    selectedFeatureIds={selectedFeatureIds}
                    metadataLink={activeLayer.getMetadataIdentifier()}
                    closeExportDataPopup={controller.closeExportDataPopup}
                    sendExportDataForm={controller.sendExportDataForm}
                />);
        }
    };
};

const ButtonWithMargin = styled(Button)`
    margin-right: 1em;
`;

export const ExportButton = (props) => {
    return <ButtonWithMargin type='primary' {...props}>
        <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.openButtonLabel'}/>
    </ButtonWithMargin>;
};
