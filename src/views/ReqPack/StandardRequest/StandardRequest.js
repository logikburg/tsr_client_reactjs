import React, {Component} from 'react';
import {
  Row,
  Col,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton
} from 'reactstrap';
import AnimateLink from "../Components/AnimateLink"
import IconPage from "../Components/IconPage"
class StandardRequest extends Component {
  constructor(props) {
    super(props);
    this.browseLink = [];
    this.handleAnimateLinkClick = this.handleAnimateLinkClick.bind(this);
    this.handleIconButtonClick = this.handleIconButtonClick.bind(this);
    this.initialState = this.initialState.bind(this);
    this.setup = this.setup.bind(this);
    this.links = []
    this.state={
      requests:null
    }
    this.initialState();
  }
  initialState(){
    
    fetch("http://express-mongo-restful-t2-tsr.dc7-openshift1.server.ha.org.hk/api/v1/standard-request/search",
      { 
        /*method:'GET'*/
        
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Origin':window.location.origin,
          'TSRAuth':"xlNIOEWONXVLSDFOiuLSKNLIUAD",
          "X-Requested-With":"XMLHttpRequest",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify(
          {
            criteria: {
              
            },
            options: {
              offset: 10,
              limit: 10
            }
          }
        )
      }
    ).then(blob => blob.json())
      .then(data => {
        this.setup(data);
      })
      .catch(e => {
        return e;
      });
    
    //setTimeout(this.setup,1000);
  }
  setup(data) {
    this.links = data;
    this.setState({
      requests:this.links[0].catelog
    });
  }
  handleAnimateLinkClick(event,link,idx) {
    event.preventDefault();
    const url = link.getDataUrl? link.getDataUrl:"";
    this.setState({requests: this.links[idx].catelog});
  }
  handleIconButtonClick(event,data) {
    if(typeof this.props.iconButtonOnClick == "function")  {
      return this.props.iconButtonOnClick(event,data);
    }
  }
  render() {
    const iconList =() => {
      if(this.state.requests != null)
        return (
          <div className="animated fadeIn ">
            <IconPage data={this.state.requests} iconButtonOnClick={(event,data) => this.handleIconButtonClick(event,data)} />
          </div>
      );
    }
    // sidebar-nav root
    return (
        <div className="animated fadeIn ">
            <AnimateLink key={"AL"+Math.floor(Math.random()*1000)}  className="second-top" data={this.links} onClick={(event,link,idx) => this.handleAnimateLinkClick(event,link,idx)} />
            <div>
              {iconList()}
            </div>
        </div>
    )
  }
}
export default StandardRequest;