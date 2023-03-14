import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Message } from 'oskari-ui';
import { UserStyleRow } from './UserStyleRow';
import { PlusOutlined } from '@ant-design/icons';

// TODO: Fix this once style accessible smarter way
const secondaryColor = '#006ce8';

const Content = styled('div')`
    padding: 24px;
    min-width: 500px;
`;

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
    &&& {
        border: solid 1px #d9d9d9;
    }
`;

const AddStyleIcon = styled(PlusOutlined)`
    margin-right: 10px;
`;

const onEdit = (id) => Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [{ id }]);
const addNew = (addToLayer) => Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [{ addToLayer }]);

export const UserStylesContent = ({ layerId, styles, onDelete }) => {
    return (
        <Content>
            <Header>
                <Message messageKey='styles' LabelComponent={HeaderText} />
                <AddStyle onClick={() => addNew(layerId)}>
                    <AddStyleIcon />
                    <Message messageKey='addStyle' LabelComponent={AddStyleText}/>
                </AddStyle>
            </Header>
            { styles.length > 0 &&
            <List bordered={false} dataSource={styles} renderItem={style => {
                const { id, name } = style;
                return (
                    <StyledListItem>
                        <UserStyleRow
                            name={name}
                            onEdit={() => onEdit(id)}
                            onDelete={() => onDelete(id)}/>
                    </StyledListItem>
                );
            }}/>
            }
        </Content>
    );
};

UserStylesContent.propTypes = {
    layerId: PropTypes.number.isRequired,
    styles: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired
};
