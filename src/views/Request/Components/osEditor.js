import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class OSEditor extends Component {
  constructor(props) {
    super(props);

    // this.onHappyClick = this.onHappyClick.bind(this);
    // this.onSadClick = this.onSadClick.bind(this);
    this.onClickWindows = this.onClickWindows.bind(this);
    this.onClickLinux = this.onClickLinux.bind(this);
    this.onClickApple = this.onClickApple.bind(this);
    this.state = {
      os: "linux"
    }
  }

  componentWillMount() {
    this.setDefaultOS("linux");
  }

  componentDidUpdate() {
    this.focus();
  }

  focus() {
    setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.container);
      if (container) {
        container.focus();
      }
    })
  }

  getValue() {
    return this.state.os ? this.state.os : "linux";
  }

  isPopup() {
    return true;
  }

  setDefaultOS(os) {
    this.setState({
      os: os
    });
  }

  onClickWindows() {
    this.setState({
      os: "windows"
    },
      () => this.props.api.stopEditing()
    );
  }
  onClickLinux() {
    this.setState({
      os: "linux"
    },
      () => this.props.api.stopEditing()
    );
  }
  onClickApple() {
    this.setState({
      os: "apple"
    },
      () => this.props.api.stopEditing()
    );
  }
  render() {
    let os = {
      borderRadius: 15,
      border: "1px solid grey",
      background: "#e6e6e6",
      padding: 15,
      textAlign: "center",
      display: "inline-block"
    };

    let unselected = {
      paddingLeft: 10,
      paddingRight: 10,
      border: "1px solid transparent",
      padding: 4
    };

    let selected = {
      paddingLeft: 10,
      paddingRight: 10,
      border: "1px solid lightgreen",
      padding: 4
    };

    return (
      <div ref="container"
        style={os}
        tabIndex={1} // important - without this the keypresses wont be caught
      >
        <span onClick={this.onClickWindows} style={this.state.os === "windows" ? selected : unselected} ><i className="fa fa-windows fa-2x" ></i></span>
        <span onClick={this.onClickLinux} style={this.state.os === "linux" ? selected : unselected} ><i className="fa fa-linux fa-2x"></i></span>
        <span onClick={this.onClickApple} style={this.state.os === "apple" ? selected : unselected} ><i className="fa fa-apple fa-2x"></i></span>
      </div>
    );
  }
}