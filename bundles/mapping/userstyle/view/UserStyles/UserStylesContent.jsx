import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Message } from 'oskari-ui';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { UserStyleRow } from './UserStyleRow';

const Content = styled('div')`
    padding: 24px;
    min-width: 500px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
`;

const HeaderText = styled.div`
    font-weight: bold;
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

const onEdit = (id) => Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [{ id }]);
const addNew = (addToLayer) => Oskari.getSandbox().postRequestByName('ShowUserStylesRequest', [{ addToLayer }]);

// TODO: maybe use layer name as content header?
export const UserStylesContent = ({ layerId, styles, onDelete }) => {
    return (
        <Content>
            <Header>
                <Message messageKey='styles' LabelComponent={HeaderText} />
                <PrimaryButton type='add' onClick={() => addNew(layerId)}/>
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
