import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, LabeledInput, TextInput } from 'oskari-ui';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { LocaleConsumer } from 'oskari-ui/util';
import { FileInput } from 'oskari-ui/components/FileInput';
import { FILE_INPUT_PROPS } from '../../constants';

const Description = styled.div`
    padding-bottom: 20px;
    ul {
        list-style: disc inside none;
        margin-left: 12px
    }
`;
const PaddingTop = styled.div`
    padding-top: 10px;
`;
const ProjectionInput = styled(TextInput)`
    margin-bottom: 10px;
`;

const renderImport = (file, maxSize, unzippedMaxSize, updateFile) => {
    const files = file ? [file] : [];
    return (
        <Fragment>
            <Description>
                <Message messageKey='flyout.description' messageArgs={{ maxSize, unzippedMaxSize }} allowHTML={true} />
            </Description>
            <FileInput mandatory onFiles={updateFile} maxSize={maxSize} files={files} { ...FILE_INPUT_PROPS } />
        </Fragment>
    );
};

export const GeneralTab = LocaleConsumer(({
    languages,
    locale,
    file,
    sourceSrs,
    isImport,
    maxSize,
    unzippedMaxSize,
    showSrs,
    updateState,
    getMessage
}) => {
    const updateLocale = (locale) => updateState({ locale });
    const updateFile = (files) => updateState({ file: files[0] });
    const updateSrs = (sourceSrs) => updateState({ sourceSrs });
    return (
        <Fragment>
            { isImport && renderImport(file, maxSize, unzippedMaxSize, updateFile) }
            <PaddingTop/>
            { showSrs &&
                <ProjectionInput placeholder={getMessage('flyout.layer.srs')} value={sourceSrs} onChange={e => updateSrs(e.target.value)}/> }
            <LocalizationComponent
                value={locale}
                languages={languages}
                onChange={updateLocale}
                showDivider
            >
                <LabeledInput type='text' name='name' label={getMessage('flyout.layer.name')} minimal={true} mandatory={true} />
                <LabeledInput type='text' name='desc' label={getMessage('flyout.layer.desc')} minimal={true} />
                <LabeledInput type='text' name='source' label={getMessage('flyout.layer.source')} minimal={true} />
            </LocalizationComponent>
        </Fragment>
    );
});

GeneralTab.propTypes = {
    languages: PropTypes.array.isRequired,
    locale: PropTypes.object.isRequired,
    file: PropTypes.object,
    sourceSrs: PropTypes.string,
    isImport: PropTypes.bool.isRequired,
    maxSize: PropTypes.number.isRequired,
    unzippedMaxSize: PropTypes.number.isRequired,
    showSrs: PropTypes.bool,
    updateState: PropTypes.func.isRequired
};
