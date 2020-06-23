import React, { Component } from 'react';
import IconPage from "../Components/IconPage";
import { connect } from 'react-redux';
import {
  Row,
  Col
} from 'reactstrap';
import {
  getConfigListUILoaded
} from "../../../_actions";
class PackageRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.handleIconButtonClick = this.handleIconButtonClick.bind(this);

  }
  componentDidMount() {
    //let arr = this.props.type === "bundle" ? this.props.bundlesUI : this.props.requestsUI;
    let arr = this.props.bundlesUI; //.concat(this.props.requestsUI);
    this.setState({
      list: arr
    })
  }
  handleIconButtonClick(event, data) {
    if (sessionStorage) sessionStorage.setItem("package-name", data.label);
    if (typeof this.props.iconButtonOnClick == "function") {
      return this.props.iconButtonOnClick(event, data);
    }
  }
  render() {
    const iconList = () => {
      return (
        <div className="animated fadeIn">
          <Row key="main" >
            <IconPage data={this.state.list} iconButtonOnClick={(event, data) => this.handleIconButtonClick(event, data)} ></IconPage>
          </Row>
        </div>
      );
    };
    return iconList();
  }
}
//   
const mapStateToProps = (state) => {
  return {
    requestsUI: state.requestReducer.configRequestUI,
    bundlesUI: state.requestReducer.configBundleUI
  }
}
export default connect(
  mapStateToProps
)(PackageRequest)
//export default PackageRequest;