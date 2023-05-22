import React from 'react';
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

const ExportDataPopup = (props) => {
    const { closeExportDataPopup } = props;
    return <>
        <FlexTableContainer>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.title'}/></ColumnHeader>
                    <RadioGroup>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.excel'}/>
                        </RadioOption>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.fileFormat.csv'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexCol>
                <FlexColRight>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.title'}/></ColumnHeader>
                    <RadioGroup>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.opened'}/>
                        </RadioOption>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.columns.all'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexColRight>
            </FlexRow>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.title'}/></ColumnHeader>
                    <RadioGroup>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.comma'}/>
                        </RadioOption>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.semicolon'}/>
                        </RadioOption>
                        <RadioOption>
                            <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.csvSeparator.tabulator'}/>
                        </RadioOption>
                    </RadioGroup>
                </FlexCol>
            </FlexRow>
            <FlexRow>
                <FlexCol>
                    <ColumnHeader><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.title'}/></ColumnHeader>
                    <Checkbox><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.dataSource'}/></Checkbox>
                    <Checkbox><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.metadataLink'}/></Checkbox>
                    <Checkbox><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.additionalSettings.onlySelected'}/></Checkbox>
                </FlexCol>
            </FlexRow>
            <FlexRowCentered>
                <SecondaryButton type='cancel' onClick={closeExportDataPopup}/>
                <Button type='primary'><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.exportButtonLabel'}/></Button>
            </FlexRowCentered>
        </FlexTableContainer>

    </>;
};

ExportDataPopup.propTypes = {
    closeExportDataPopup: PropTypes.func
};

export const showExportDataPopup = (state, controller) => {
    const content = <ExportDataPopup
        closeExportDataPopup={controller.closeExportDataPopup}
    />;
    const title = <><Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.title'}/></>;
    const controls = showPopup(title, content, () => { controller.closeExportDataPopup(); }, {});

    return {
        ...controls,
        update: (state) => {
            controls.update(title,
                <ExportDataPopup
                    closeExportDataPopup={controller.closeExportDataPopup}
                />);
        }
    };
};

export const ExportButton = (props) => {
    return <Button type='primary' {...props}>
        <Message bundleKey={FEATUREDATA_BUNDLE_ID} messageKey={'exportDataPopup.openButtonLabel'}/>
    </Button>;
};
