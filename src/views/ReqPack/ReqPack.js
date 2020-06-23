import React, { Component } from 'react';
import PackageRequest from './PackageRequest';
import AnimateLink from "./Components/AnimateLink";
//import Scrollbars from  "../../components/CustomScrollbar/index"
//import _ from 'lodash'

class RequestPackage extends Component {
  constructor(props) {
    super(props);
    this.handleIconButtonOnClick = this.handleIconButtonOnClick.bind(this);
  }
  handleIconButtonOnClick(event, data) {
    if (typeof this.props.iconButtonOnClick == "function") {
      return this.props.iconButtonOnClick(event, data);
    }
  }
  render() {
    if (this.props.location) {
      return (
        <div className="animated fadeIn ">
          {/* <AnimateLink key={"AL" + Math.floor(Math.random() * 1000)} className="top" title="Package Service" /> */}
          <PackageRequest type={this.props.match.params["type"]} iconButtonOnClick={(event) => this.handleIconButtonOnClick(event)} />
        </div>
      );
    } else {
      return (
        <div className="animated fadeIn ">
          <AnimateLink key={"AL" + Math.floor(Math.random() * 1000)} className="top" data={this.links} onClick={(event, data, idx) => { event.preventDefault(); this.toggle(idx); }} />
          {/* <Scrollbars autoHeight autoHeightMin={"10rem"} autoHeightMax={"22rem"}  autoHide={true} autoHideTimeout={1000} autoHideDuration={500}>
                    <div style={{    width: "95%", margin: "0 auto"}} >
                        
                    </div>
      </Scrollbars> */}
          {this.showCategory()}
        </div>
      );
    }
  }
}

export default RequestPackage;