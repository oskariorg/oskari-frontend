import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';
import { CloudUploadOutlined, CloseCircleOutlined  } from '@ant-design/icons';

const MAX_SIZE = 10; //MB
const MAX_COUNT = 5;

const Border = styled('div')`
    display: block;
    width: 100%;
    min-height: 70px;
    padding: 12px;
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    transition: border-color .3s;
    &:hover{
        border-color: #40a9ff;
    }
`;
const StyledLabel = styled('label')`
    cursor: pointer;
    padding: 12px;
    &:hover{
        color: #40a9ff;
    }
`;
const HiddenFileInput = styled('input')`
    display: none;
`;
const StyledFileList = styled('div')`
    padding: 0px 12px;
    margin-top: 8px;
`;
const StyledUploadIcon = styled(CloudUploadOutlined)`
    padding-right: 10px;
`;

const StyledListItem = styled('span')`
    white-space: nowrap;
    padding-left: 5px;
    display: inline-block;
`;
const StyledName = styled('span')`
    color: #40a9ff;
    padding-right: 5px;
`;

const getMsg = (path, args) => <Message messageKey={`FileInput.${path}`} bundleKey='oskariui' messageArgs={args}/>;

const prevent = e => e.preventDefault();

const showError = (key, args) => {
    const content = getMsg(`error.${key}`, args);
    Messaging.error({ content, duration: 5 });
}

export const FileInput = ({ 
    onFiles,
    multiple=true,
    tooltip,
    allowedTypes = [],
    maxSize = MAX_SIZE,
    files = []
}) => {
    const [currentFiles, setFiles] = useState(files);
    const maxCount = multiple ? MAX_COUNT : 1;

    const onDrop = event => {
        event.preventDefault();
        handleInputFiles(event.dataTransfer.files);
    };
    const handleInputFiles = inputFiles => {
        // Special case for single option to override existing file
        if (!multiple && inputFiles.length === 1) {
            const file = inputFiles[0];
            if (validate(file)) {
                onFiles([file]);
                setFiles([file]);
            }
            return;
        }
        if (inputFiles.length + currentFiles.length > maxCount) {
            const errorKey = maxCount === 1 ? 'multipleNotAllowed' : 'maxCountExceeded';
            showError(errorKey);
            return;
        }
        const validFiles = [];
        // FileList (not array) doesn't have filter, use forEach to filter valid files
        inputFiles.forEach(file => validate(file) && validFiles.push(file));
        const files = [...currentFiles, ...validFiles];
        onFiles(files);
        setFiles(files);
    };

    const validate = file => {
        const validType = !allowedTypes.length || allowedTypes.includes(file.type);
        if (!validType) {
            showError('invalidType');
        }
        const validSize = file.size < (maxSize * 1024 * 1024);
        if (!validSize) {
            showError('fileSize', { maxSize });
        }
        return validType && validSize;
    };

    const onFileRemove = name => {
        const files = currentFiles.filter(file => file.name !== name);
        setFiles(files);
        onFiles(files);
    };

    return (
        <Tooltip title={ tooltip } trigger={ ['focus', 'hover'] }>
            <Border
                className="t_fileinput_dropzone"
                onDrop={onDrop}
                onDragOver={prevent}
                onDragEnter={prevent}
                onDragLeave={prevent}
            >
                <StyledLabel>
                    <HiddenFileInput
                        type="file"
                        multiple= {multiple}
                        accept={allowedTypes.join(',')}
                        onChange={e => handleInputFiles(e.target.files)}
                    />
                    <StyledUploadIcon className="t_fileinput_btn" style={{ fontSize: '30px', color: '#006ce8'}}/>
                    { getMsg('drag',{ maxCount }) }
                </StyledLabel>
                <StyledFileList className="t_fileinput_list">
                    { currentFiles.map( ({name}) => <FileListItem name={name} onRemoveClick={onFileRemove} key={name} />) }
                </StyledFileList>
            </Border>
        </Tooltip>
    );
};

const FileListItem = ({name, onRemoveClick}) => {
    return (
        <StyledListItem>
            <StyledName>{ name }</StyledName>
            <CloseCircleOutlined className="t_fileinput_remove" onClick={()=>onRemoveClick(name)}/>
        </StyledListItem>
    );
};

FileInput.propTypes = {
    onFiles: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    allowedTypes: PropTypes.array,
    tooltip: PropTypes.string,
    maxSize: PropTypes.number
};
