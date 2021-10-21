import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Message } from 'oskari-ui';
import { UserStyleRow } from './UserStyles/UserStyleRow';
import { PlusOutlined } from '@ant-design/icons';

// TODO: Fix this once style accessible smarter way
const secondaryColor = '#006ce8';

const Header = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const HeaderText = styled.div`
    padding-top: 10px;
    font-weight: bold;
    flex: 0 0 300px;
`;

const AddStyle = styled.div`
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
    background-color: #ffffff;
    padding: 10px;
    cursor: pointer;
    color: ${secondaryColor};
`;

const AddStyleText = styled.div`
    display: inline-block;
`;

const StyledListItem = styled(ListItem)`
    &:nth-child(even) {
        background-color: #f3f3f3;
    }
    &:nth-child(odd) {
        background-color: #ffffff;
    }
    border-style: solid;
    border-width: 0.5px;
    border-color: #d9d9d9;
`;

const AddStyleIcon = styled(PlusOutlined)`
    margin-right: 10px;
`;

const showVisualizationForm = (layerId, styleName) => {
    Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [layerId, true, styleName]);
};

export const UserStyles = ({ layerId, styles, removeUserStyleHandler }) => {
    return (
        <div>
            <Header>
                <Message messageKey='styles' LabelComponent={HeaderText} />
                <AddStyle onClick={() => showVisualizationForm(layerId)}>
                    <AddStyleIcon />
                    <Message messageKey='addStyle' LabelComponent={AddStyleText}/>
                </AddStyle>
            </Header>
            { styles && styles.length > 0 &&
            <List bordered={false} dataSource={styles} renderItem={style => {
                const name = style.getName();
                const title = style.getTitle();
                return (
                    <StyledListItem>
                        <UserStyleRow styleTitle={title}
                            editUserStyleHandler={() => showVisualizationForm(layerId, name)}
                            removeUserStyleHandler={() => removeUserStyleHandler(layerId, name)}/>
                    </StyledListItem>
                );
            }}/>
            }
        </div>
    );
};

UserStyles.propTypes = {
    layerId: PropTypes.number.isRequired,
    styles: PropTypes.array.isRequired,
    removeUserStyleHandler: PropTypes.func.isRequired
};
