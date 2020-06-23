import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { connect } from 'react-redux';
import { login } from '../../../_actions/simlogin.actions';
import PropTypes from 'prop-types';
import { sysConfig } from "../../../_config";
import axios from 'axios';

class TempLogin extends Component {
  constructor(props) {
    super(props);
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    this.state = from;
    this.onSubmit = this.onSubmit.bind(this);
    this.onPress = this.onPress.bind(this);
  }


  render() {
    //let { corpid, team, role } = this.state;
    let { corpid } = this.state;
    let { isLoginPending, isLoginSuccess, loginError } = this.props;
    const { formState, currentlySending, loggedIn, error } = this.props.data.userReducer
    console.log('UI Err: ', error)
    console.log('currentlySending: ', currentlySending)

    //Always Clear localStorage
    //localStorage.removeItem('user');
    //this.props.dispatch(logout())

    return (
      <form name="loginForm" onSubmit={this.onSubmit}>
        <div className="app flex-row align-items-center login-container-wrapper">
          <div class="background-image">
          </div>
          <Container className="login-container">
            <Row className="justify-content-center">
              <Col md="6">
                <CardGroup>
                  <Card className="p-4 login-box">
                    <CardBody>
                      <div className="login-logo">
                        <img src="/assets/img/logo.png" />
                      </div>

                      {(currentlySending || loggedIn) && <div><i className="fa fa-spin fa-spinner"></i> going in...</div>}
                      {loggedIn && <Redirect to="/" />}

                      {!(currentlySending || loggedIn) && <div>
                        <Row>
                          <Col className="ml-auto">
                            <div className="message">

                              {isLoginPending && <div><i className="fa fa-spin fa-spinner"></i> Checking...</div>}
                              {error && <div>{error.message}</div>}
                              {!isLoginPending && !error && <div>&nbsp;</div>}
                            </div>
                          </Col>
                        </Row>

                        <InputGroup className="mb-3">
                          <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                          <Input id="login-form-corpid" type="text" placeholder="corpid" onChange={e => this.setState({ corpid: e.target.value })} value={corpid} />
                        </InputGroup>
                        {/* 
                        <InputGroup className="mb-4">
                          <InputGroupAddon><i className="icon-people"></i></InputGroupAddon>
                          <Input id="login-form-team" type="text" placeholder="team" onKeyPress={this.onPress} onChange={e => this.setState({ team: e.target.value })} value={team} />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon><i className="icon-badge"></i></InputGroupAddon>
                          <Input id="login-form-role" size="3" type="select" placeholder="team" onKeyPress={this.onPress} onChange={e => this.setState({ role: e.target.value })} value={role} >
                            <option value="Requester">Requester</option>
                            <option value="Support">Support</option>
                            <option value="Manager">Manager</option>
                          </Input>
                        </InputGroup>
*/}

                        <Row>
                          <Col></Col>
                          <Col xs="12">
                            <div>
                              <Button size="lg" id="login-form-submit" color="primary" className={isLoginPending ? "hidden" : "show"} onClick={this.onSubmit} block>Login (Testing Version)</Button>
                            </div>

                          </Col>
                          <Col>

                          </Col>
                        </Row>


                      </div>}

                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>

      </form>
    );
  }


  onSubmit(e) {
    e.preventDefault();
    //let { corpid, team, role } = this.state;
    let state = this.state;
    this.props.dispatch(login(state))
    //localStorage.setItem('user', JSON.stringify({ corpid: corpid, team: team, role: role  }));

    //let { username, password } = this.state;

    //this.props.login(corpid, team, role);
    //this.props.dispatch(login({ corpid, team, role }))
    /*
    let responseJson = {
      id: corpid,
      fullname: 'User Fullname',
      email: 'user.email',
      displayname: ' ',
      avatar: 'assets/img/avatars/' + random(0, 9) + '.jpg',
      token: 'user.token',
      authenticated: true
    };
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(responseJson));
    window.location = "/";
*/
    //getUserInfo(corpid);
    //window.location = "/";
    //state.userReducer.loginError = true;
    //state.userReducer.loginError = "Testing";
    //this.state.loginError = new Error('Wrong ID or password');
    //this.state.loginError = new Error('Wrong ID or password');
    //console.log(this.state.loginError.message);
    /*
    var url = sysConfig.API_TSR_PREFIX + '/user/getUserV1/' + corpid;
    //console.log('url: ' + url);

    axios.get(url)
      .then((response) => {
        // handle success
        //console.log('response: ' + JSON.stringify(response));
        if (response.data) {
          //console.log(response.data);
          //this.setState({ bundles: response.data.bundles });
          let imgAvatar;
          let responseJson
          if (typeof response.data[0] != 'undefined' && response.data[0]) {
            console.log("Found Avatar");
            imgAvatar = response.data[0].avatar;
            responseJson = {
              id: corpid,
              fullname: response.data[0].fullname,
              email: response.data[0].email,
              displayname: response.data[0].displayname,
              avatar: imgAvatar,
              token: 'temp token',
              authenticated: true
            };

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(responseJson));
            var userTest = localStorage.getItem('user');
            console.log('LocalStorage: ', userTest)
            window.location = "/";


          } else {
            console.log("No Avatar");
            imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
            responseJson = {
              id: corpid,
              fullname: 'fullname not found',
              email: 'email not found',
              displayname: 'displayname not found',
              avatar: imgAvatar,
              token: 'temp token',
              authenticated: true
            };

          }
          
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          //localStorage.setItem('user', JSON.stringify(responseJson));
          //var userTest = localStorage.getItem('user');
          //console.log('LocalStorage: ', userTest)
          //window.location = "/";
          
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      */

  }

  /*
  onSubmit(e) {
    e.preventDefault();
    //let { corpid, team, role } = this.state;
    let { corpid } = this.state;
    //this.props.dispatch(login({ corpid }))

    //localStorage.setItem('user', JSON.stringify({ corpid: corpid, team: team, role: role  }));

    //let { username, password } = this.state;

    //this.props.login(corpid, team, role);
    //this.props.dispatch(login({ corpid, team, role }))
   
    //getUserInfo(corpid);
    //window.location = "/";
    //state.userReducer.loginError = true;
    //state.userReducer.loginError = "Testing";
    //this.state.loginError = new Error('Wrong ID or password');
    //this.state.loginError = new Error('Wrong ID or password');
    //console.log(this.state.loginError.message);
    var url = sysConfig.API_TSR_PREFIX + '/user/getUserV1/' + corpid;
    //console.log('url: ' + url);

    axios.get(url)
      .then((response) => {
        // handle success
        //console.log('response: ' + JSON.stringify(response));
        if (response.data) {
          //console.log(response.data);
          //this.setState({ bundles: response.data.bundles });
          let imgAvatar;
          let responseJson
          if (typeof response.data[0] != 'undefined' && response.data[0]) {
            console.log("Found Avatar");
            imgAvatar = response.data[0].avatar;
            responseJson = {
              id: corpid,
              fullname: response.data[0].fullname,
              email: response.data[0].email,
              displayname: response.data[0].displayname,
              avatar: imgAvatar,
              token: 'temp token',
              authenticated: true
            };

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(responseJson));
            var userTest = localStorage.getItem('user');
            console.log('LocalStorage: ', userTest)
            window.location = "/";


          } else {
            console.log("No Avatar");
            imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
            responseJson = {
              id: corpid,
              fullname: 'fullname not found',
              email: 'email not found',
              displayname: 'displayname not found',
              avatar: imgAvatar,
              token: 'temp token',
              authenticated: true
            };

          }

        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
*/
  onPress(e) {
    if (e.which == 13 || e.keyCode == 13) {
      e.target.blur();
      //let { corpid, team, role } = this.state;
      let { corpid } = this.state;
      //localStorage.setItem('user', JSON.stringify({ corpid: corpid }));
      //window.location = "/";
      //getUserInfo(corpid);
      var url = sysConfig.API_TEST_PREFIX + '/tsr/user/getUserV1/' + corpid;
      //console.log('url: ' + url);

      axios.get(url)
        .then((response) => {
          // handle success
          //console.log('response: ' + JSON.stringify(response));
          if (response.data) {
            //console.log(response.data);
            //this.setState({ bundles: response.data.bundles });
            let imgAvatar;
            let responseJson
            if (typeof response.data[0] != 'undefined' && response.data[0]) {
              console.log("Found Avatar");
              imgAvatar = response.data[0].avatar;
              responseJson = {
                id: corpid,
                fullname: response.data[0].fullname,
                email: response.data[0].email,
                displayname: response.data[0].displayname,
                avatar: imgAvatar,
                token: 'temp token',
                authenticated: true
              };

            } else {
              console.log("No Avatar");
              imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
              responseJson = {
                id: corpid,
                fullname: 'fullname not found',
                email: 'email not found',
                displayname: 'displayname not found',
                avatar: imgAvatar,
                token: 'temp token',
                authenticated: true
              };

            }
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(responseJson));
            var userTest = localStorage.getItem('user');
            console.log('LocalStorage: ', userTest)
            window.location = "/";
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }
}


/*
const mapStateToProps = (state) => {
  return {
    isLoginPending: state.userReducer.isLoginPending,
    isLoginSuccess: state.userReducer.isLoginSuccess,
    loginError: state.userReducer.loginError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    //login: (username, password) => dispatch(login(username, password))
    login: (corpid, team, role) => dispatch(login(corpid, team, role))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TempLogin);
*/

TempLogin.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object,
  dispatch: PropTypes.func
}

// Which props do we want to inject, given the global state?
function select(state) {
  return {
    data: state
  }
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(TempLogin)