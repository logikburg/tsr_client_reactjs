import React, { Component } from "react";

export default class OSRenderer extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentWillMount() {
    this.setOS(this.props.value)
  }

  refresh(params) {
    this.setOS(params.value);
  }

  setOS(os) {
    this.setState({
      imgForOS: os === 'windows' ? 'windows' : os === 'apple' ? 'apple' : 'linux'
    })
  };

  render() {
    return (
      <span><i className={"fa fa-" + this.state.imgForOS + " fa-2x"}></i></span>
      // <img width="20px" src={this.state.imgForOS} />
    );
  }
}

//<i class="fab fa-microsoft"></i>
//<i class="fab fa-windows"></i>
//<i class="fab fa-linux"></i>
//<i class="fab fa-apple"></i>