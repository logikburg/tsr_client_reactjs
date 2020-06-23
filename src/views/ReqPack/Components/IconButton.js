import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';

const propTypes = {
    className: PropTypes.string,
    cssModule: PropTypes.object,
    dataBox: PropTypes.func
};

const defaultProps = {
    dataBox: {}
};

class IconButton extends Component {
    constructor(props) {
        super(props);
        this.handleIconButtonClick = this.handleIconButtonClick.bind(this);
        this.handleIconCloseClick = this.handleIconCloseClick.bind(this);
    }
    handleIconButtonClick(event, data) {
        if (typeof this.props.iconButtonOnClick == "function") {
            return this.props.iconButtonOnClick(event, data);
        }
    }
    handleIconCloseClick = (event, data) => {
        if (typeof this.props.iconCloseOnClick === "function") {
            return this.props.iconCloseOnClick(event, data);
        }
    }
    render() {
        const { dataBox } = this.props;
        console.log("")
        // demo purposes only
        const data = dataBox();
        const variant = data.variant;
        const label = data.title;//label;
        const url = "#/" + data._id + "/new"//"#" + data.url;
        const is_enable = data.enable;
        if (!variant) {
            return "gear";
        }

        const icon = "fa fa-" + variant;

        if (is_enable) {
            return (
                <a className="request-category-icon" href={url} onClick={(event, label) => this.handleIconButtonClick(event, label)}>
                    {
                        this.props.closeButton &&
                        (<span onClick={(event, label) => this.handleIconCloseClick(event, label)}><i className="fa fa-close"></i></span>)
                    }
                    <center><i className={icon}></i></center>
                    <div>
                        <center>
                            <Label>{label}</Label>
                        </center>
                    </div>
                </a>
            )
        } else {
            return (
                <a href="#" className="request-category-icon-disabled">
                    <center><i className={icon}></i></center>
                    <div>
                        <center>
                            <Label>{label}</Label>
                        </center>
                    </div>
                </a>
            )
        }

    }
}

IconButton.propTypes = propTypes;
IconButton.defaultProps = defaultProps;

export default IconButton;