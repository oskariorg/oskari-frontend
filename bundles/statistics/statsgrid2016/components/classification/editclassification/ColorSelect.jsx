import React from 'react';
import PropTypes from 'prop-types';
import { withContext, handleBinder } from 'oskari-ui/util';
import { colorSetColorWidth } from './colorselect.scss';

class ColorSelect extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isOpen: false
        };
        handleBinder(this);
    }
    componentDidMount () {
        document.addEventListener('mouseup', this.handleClick);
    }
    componentWillUnmount () {
        document.removeEventListener('mouseup', this.handleClick);
    }
    handleClick (event) {
        if (this.props.disabled) {
            return;
        }
        const outside = this.wrapperRef && !this.wrapperRef.contains(event.target);
        if (outside && this.state.isOpen) {
            this.setState({ isOpen: false });
        } else if (!outside) {
            this.setState(oldState => ({ isOpen: !oldState.isOpen }));
        }
    }
    handleWrapperRef (node) {
        this.wrapperRef = node;
    }

    // color: 'deebf7'
    getSimpleColorElement (color) {
        return (
            <div className="oskari-color-simple">
                <div className="oskari-color" style={{ background: '#' + color, opacity: this.props.opacity }}/>
            </div>
        );
    }

    // color: {id:'Blues', value:['deebf7','9ecae1','3182bd']}
    getMultiColorElement (color) {
        const colors = color.value;
        const width = parseInt(colorSetColorWidth) * colors.length;
        return (
            <div className="oskari-color-set" style={{ width: width + 'px' }}>
                {colors.map(color =>
                    <div className="oskari-color" key = {color} style={{ background: '#' + color, opacity: this.props.opacity }}/>
                )}
            </div>
        );
    }

    getColorSelection () {
        if (!this.state.isOpen) {
            return;
        }
        const colors = this.props.colors;
        return (
            <div className="oskari-color-selection">
                {colors.map((color, index) => {
                    if (this.props.isSimple) {
                        return (
                            <div className="oskari-color-option" key={index} onMouseDown={() => this.props.handleColorChange(index)}>
                                {this.getSimpleColorElement(color)}
                            </div>
                        );
                    } else {
                        return (
                            <div className="oskari-color-option" key={color.id} onMouseDown={() => this.props.handleColorChange(color.id)}>
                                {this.getMultiColorElement(color)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }
    getSelectedColor () {
        const value = this.props.value;
        const colors = this.props.colors;
        let selected;
        if (this.props.isSimple) {
            selected = colors[value];
        } else {
            selected = colors.find(color => color.id === value);
        }
        if (selected) {
            return selected;
        }
        return colors[0];
    }

    render () {
        const selected = this.getSelectedColor();
        const className = this.props.disabled ? 'oskari-color-selection-main disabled' : 'oskari-color-selection-main';
        return (
            <div className={className}>
                <div className = "oskari-selected-color-wrapper" ref={this.handleWrapperRef}>
                    <div className = "oskari-selected-color">
                        <div className="oskari-color-option">
                            {this.props.isSimple ? this.getSimpleColorElement(selected) : this.getMultiColorElement(selected)}
                        </div>
                    </div>
                    <div className="color-selection-arrow">
                        <div className="icon-arrow-down"/>
                    </div>
                </div>
                {this.getColorSelection()}
            </div>
        );
    }
};

ColorSelect.propTypes = {
    colors: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    disabled: PropTypes.bool.isRequired,
    isSimple: PropTypes.bool.isRequired,
    opacity: PropTypes.number.isRequired,
    handleColorChange: PropTypes.func.isRequired,
    loc: PropTypes.func.isRequired
};

const contextWrapped = withContext(ColorSelect);
export { contextWrapped as ColorSelect };
