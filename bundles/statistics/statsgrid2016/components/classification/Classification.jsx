import React from 'react';
import PropTypes from 'prop-types';
import {withContext, handleBinder} from '../../../../../src/react/util.jsx';
import {EditClassification} from './editclassification/EditClassification';
import {Legend} from './Legend';
import {Header} from './Header';
import './classification.scss';

class Classification extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEdit: props.isEdit
        };
        handleBinder(this);
    }
    componentDidMount () {
        this.props.onRenderChange();
    }
    componentDidUpdate () {
        this.props.onRenderChange(true, this.state.isEdit);
    }
    handleToggleClassification () {
        this.setState(oldState => ({ isEdit: !oldState.isEdit }));
    }

    render () {
        const classifications = this.props.classifications;
        const isEdit = this.state.isEdit;

        return (
            <div className="statsgrid-classification-container">
                <Header active = {this.props.indicators.active} isEdit = {isEdit}
                    handleClick = {this.handleToggleClassification}
                    indicators = {this.props.indicators.selected}/>
                {isEdit &&
                    <EditClassification classifications = {classifications}
                        indicators = {this.props.indicators}/>
                }
                <Legend legendProps = {this.props.legendProps}
                    indicatorData = {this.props.indicators.data}
                    transparency = {classifications.values.transparency}/>
            </div>
        );
    }
}

Classification.propTypes = {
    indicators: PropTypes.object,
    classifications: PropTypes.object,
    state: PropTypes.object,
    isEdit: PropTypes.bool,
    legendProps: PropTypes.object,
    onRenderChange: PropTypes.func,
    service: PropTypes.object,
    loc: PropTypes.func
};

const cls = withContext(Classification);
export {cls as Classification};
