import React, { Component } from 'react';
import PackageRequest from './PackageRequest';
import AnimateLink from "./Components/AnimateLink";
import { connect } from 'react-redux';
import {
  Label, Row,
  Col
} from 'reactstrap';

//import Scrollbars from  "../../components/CustomScrollbar/index"
//import _ from 'lodash'

class ReqIndividual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      srvGrp: {},
    }
    this.handleIconButtonOnClick = this.handleIconButtonOnClick.bind(this);

  }
  handleIconButtonOnClick(event, data) {
    if (typeof this.props.iconButtonOnClick == "function") {
      return this.props.iconButtonOnClick(event, data);
    }
  }

  componentDidMount() {
    let _srvGrp = {};
    if (Array.isArray(this.props.requestsUI)) {
      this.props.requestsUI.forEach((req) => {
        if (req.enable)
          if (_srvGrp[req.service_group]) {
            _srvGrp[req.service_group].push(req);
          }
          else {
            _srvGrp[req.service_group] = [];
            _srvGrp[req.service_group].push(req);
          }
      })
    }

    this.setState({
      srvGrp: _srvGrp
    })
  }

  render() {

    let rows = [];
    for (const key in this.state.srvGrp) {
      rows.push(
        <Col xs="6" lg="4" md="5" style={{ minWidth: "300px" }} key={key}>
          <div className="request-group-icon">
            <Label>{key}</Label>
            <br />
            <AnimateLink key={key + Math.floor(Math.random() * 1000)} className="top" data={this.state.srvGrp[key]} />
          </div>
        </Col>
      )
    }

    return (
      <div className="animated fadeIn">
        <Row key="main" >
          {rows}
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    requestsUI: state.requestReducer.configRequestUI,
    bundlesUI: state.requestReducer.configBundleUI
  }
}

export default connect(
  mapStateToProps
)(ReqIndividual)
