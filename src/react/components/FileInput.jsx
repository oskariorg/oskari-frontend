import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Tooltip } from 'oskari-ui';
import { Messaging } from 'oskari-ui/util';
import Upload from 'antd/es/upload/Upload';
import { CloudUploadOutlined, CloseCircleOutlined  } from '@ant-design/icons';

const MAX_SIZE = 10; //MB
const MAX_COUNT = 5;

const Padding = styled('div')`
    padding: 12px 24px;
`;

const Border = styled('div')`
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    width: 100%;
    cursor: pointer;
    transition: border-color .3s;
    margin-bottom: 10px;
    display: inline-block;
    &:hover{
        border-color: #40a9ff;
    }
`;
const Icon = styled(CloudUploadOutlined)`
    padding-right: 10px;
`;

const getMsg = (path, args) => <Message messageKey={`FileInput.${path}`} bundleKey='oskariui' messageArgs={args}/>;

const uploadListOptions = {
    showPreviewIcon: false, 
    removeIcon: <CloseCircleOutlined /> // override default trash icon to get rid of hard coded title
};

const uploadListItemIconRenderer = () => null; // remove paper clipper (needs some styling)

// Another way to avoid uploadin files
const fakeRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

const showError = (key, args) => {
    const content = getMsg(`error.${key}`, args);
    Messaging.error({ content, duration: 5 });
}


const onChange = (info, onFiles) => {
    const { fileList } = info; // { file, fileList }
    const files = fileList
        .map(f => f.originFileObj)
        .filter(f => {
            if (typeof f !== 'undefined'){
                return true;
            }
            Oskari.log('FileInput').warn('Could not find original File object');
        });
        
    onFiles(files);
};

const validate = (file, fileList, maxCount, maxSize, allowedTypes  ) => {
    if (fileList.length > maxCount) {
        const errorKey = maxCount === 1 ? 'multipleNotAllowed' : 'maxCountExceeded';
        showError(errorKey);
        return Upload.LIST_IGNORE;
    }
    const validType = Array.isArray(allowedTypes) && allowedTypes.length ? allowedTypes.includes(file.type) : true;
    if (!validType) {
        showError('invalidType');
    }
    const validSize = file.size < (maxSize * 1024 * 1024);
    if(!validSize) {
        showError('fileSize', { maxSize });
    }
    // to avoid uploading files return false (Uploading will be stopped with false), LIST_IGNORE doesn't add file
    // FIXME: LIST_IGNORE doesn't seem to work. Maybe use customized file listing or crate own (and get rid of antd)
    return validType && validSize ? false : Upload.LIST_IGNORE;
};

export const FileInput = ({ 
    onFiles,
    multiple=true,
    tooltip,
    allowedTypes,
    maxSize = MAX_SIZE 
}) => {
    const maxCount = multiple ? MAX_COUNT : 1;

    return (
        <Tooltip title={ tooltip } trigger={ ['focus', 'hover'] }>
            <Border>
                <Upload
                    multiple = {multiple}
                    maxCount = {maxCount}
                    onChange = {info => onChange(info, onFiles)}
                    className="upload-list-inline"
                    beforeUpload = {(file, fileList) => validate(file, fileList, maxCount, maxSize, allowedTypes)} 
                    showUploadList = {uploadListOptions}
                    iconRender = {uploadListItemIconRenderer}
                    customRequest = {fakeRequest}
                >
                    <Padding>
                        <Icon style={{ fontSize: '30px', color: '#006ce8'}}/>
                        { getMsg('drag',{ maxCount }) }
                    </Padding>
                </Upload>
            </Border>
        </Tooltip>
    );
};

FileInput.propTypes = {
    onFiles: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    allowedTypes: PropTypes.array,
    tooltip: PropTypes.string,
    maxSize: PropTypes.number
};
