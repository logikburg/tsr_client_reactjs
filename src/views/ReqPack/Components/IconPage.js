import React, { Component } from 'react';
import {
    Row,
    Col
} from 'reactstrap';
// import classNames from 'classnames';
import IconButton from "./IconButton";
// import { mapToCssModules } from 'reactstrap/lib/utils';

class IconPage extends Component {
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
    handleIconCloseClick(event, data) {
        if (typeof this.props.iconCloseOnClick == "function") {
            return this.props.iconCloseOnClick(event, data);
        }
    }
    IconList() {
        if (this.props.data) {
            var rows = [];
            this.props.data.forEach((icon, idx) => {
                // if (idx % 4 === 0) rows.push([]);
                rows.push(
                    <Col xs="6" lg="4" md="5" style={{ minWidth: "300px" }} key={idx}>
                        <IconButton
                            closeButton={(icon.showClose !== false && true) && this.props.closeButton}
                            iconCloseOnClick={(event) => this.handleIconCloseClick(event, icon)}
                            dataBox={() => (icon)}
                            iconButtonOnClick={(event) => this.handleIconButtonClick(event, icon)}
                        />
                    </Col>
                );
            });
            return rows;
            // .map((row, i) => {
            // return (
            //     // <Row key={i} >
            //         {row}
            //     // </Row>
            // );

        }
    }
    render() {
        return this.IconList();
    }
}

export default IconPage;