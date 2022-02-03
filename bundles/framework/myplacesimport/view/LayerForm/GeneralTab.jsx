import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, TextInput } from 'oskari-ui';
import { LocalizationComponent } from 'oskari-ui/components/LocalizationComponent';
import { FileInput } from 'oskari-ui/components/FileInput';
import { BUNDLE_NAME, FILE_INPUT_PROPS } from '../../constants';

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
const Input = styled(TextInput)`
    margin-bottom: 10px;
`;

const getPlaceholder = name => Oskari.getMsg(BUNDLE_NAME, `flyout.layer.${name}`);

const renderImport = (file, maxSize, updateFile) => {
    const files = file ? [file] : [];
    return (
        <Fragment>
            <Description>
                <Message messageKey='flyout.description' messageArgs={{ maxSize }} allowHTML={true} />
            </Description>
            <FileInput mandatory onFiles={updateFile} maxSize={maxSize} files={files} { ...FILE_INPUT_PROPS } />
        </Fragment>
    );
};

export const GeneralTab = ({
    languages,
    locale,
    file,
    sourceSrs,
    isImport,
    maxSize,
    showSrs,
    updateState
}) => {
    const defaultLang = languages[0];
    const updateLocale = (locale) => updateState({ locale });
    const updateFile = (files) => updateState({ file: files[0] });
    const updateSrs = (sourceSrs) => updateState({ sourceSrs });
    return (
        <Fragment>
            { isImport && renderImport(file, maxSize, updateFile) }
            <PaddingTop/>
            { showSrs &&
                <Input placeholder={getPlaceholder('srs')} value={sourceSrs} onChange={e => updateSrs(e.target.value)}/> }
            <LocalizationComponent
                value={locale}
                languages={languages}
                onChange={updateLocale}
                showDivider
            >
                <Input type='text' name='name' placeholder={getPlaceholder('name')} mandatory={[defaultLang]}/>
                <Input type='text' name='desc' placeholder={getPlaceholder('desc')}/>
                <Input type='text' name='source' placeholder={getPlaceholder('source')}/>
            </LocalizationComponent>
        </Fragment>
    );
};

GeneralTab.propTypes = {
    languages: PropTypes.array.isRequired,
    locale: PropTypes.object.isRequired,
    file: PropTypes.object,
    sourceSrs: PropTypes.string,
    isImport: PropTypes.bool.isRequired,
    maxSize: PropTypes.number.isRequired,
    showSrs: PropTypes.bool,
    updateState: PropTypes.func.isRequired
};
