import { userConstants } from '../_constants/user.constants';
import { sysConfig } from "../_config";

import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  SET_AUTH,
  LOGOUT,
  CHANGE_FORM,
  REQUEST_ERROR,
  LOGIN_PENDING
} from './constants'

const SET_LOGIN_PENDING = userConstants.SET_LOGIN_PENDING;
const SET_LOGIN_SUCCESS = userConstants.SET_LOGIN_SUCCESS;
const SET_LOGIN_ERROR = userConstants.SET_LOGIN_ERROR;



export function login(data) {
  /*
    return dispatch => {
      dispatch(setLoginPending(true));
      dispatch(setLoginSuccess(false));
      dispatch(setLoginError(null));
  
      //Checking the Login via LDAP
      callSimLoginApi(data.corpid, error => {
        dispatch(setLoginPending(false));
        if (!error) {
          dispatch(setLoginSuccess(true));
        } else {
          dispatch(setLoginError(error));
        }
      });
    }
    */
  return { type: LOGIN_REQUEST, data }
}

export function logout(data) {
  return { type: LOGOUT, data }
}


function setLoginPending(isLoginPending) {
  return {
    type: SET_LOGIN_PENDING,
    isLoginPending
  };
}

function setLoginSuccess(isLoginSuccess) {
  return {
    type: SET_LOGIN_SUCCESS,
    isLoginSuccess
  };
}

function setLoginError(loginError) {
  return {
    type: SET_LOGIN_ERROR,
    loginError
  }
}

function getUserInfo(user) {
  //fetch(sysConfig.API_TEST_PREFIX + '/raw/v1-dat-userprofile/search',
  fetch(sysConfig.API_TEST_PREFIX + '/raw/user_profiles/search',
    {
      /*method:'GET'*/

      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        //'Access-Control-Allow-Origin': 'https://tsr-api-test-tsr-development.dc7-openshift2.server.ha.org.hk',
        //'Access-Control-Request-Headers': 'X-Requested-with, x-requesting-user-agent',
        //'Access-Control-Request-Headers': 'Origin, X-Requested-with, x-requesting-user-agent, Accept',
        //'Access-Control-Request-Method': 'GET,PUT,POST,DELETE',
        'Content-Type': 'application/json; charset=utf-8',
        'Origin': window.location.origin,
        'TSRAuth': "xlNIOEWONXVLSDFOiuLSKNLIUAD",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify(
        {
          criteria: {
            userid: user.loginid
          },
          options: {
            offset: 10,
            limit: 10
          }
        }
      )
    }
  ).then(response => {


    if (response.status !== 200) {
      Promise.reject('Unauthorised');
      console.log('Response.Status: ' + response);
      alert("Fail to login");
    }

    //this.updateLoadingState(true);
    return response.json();
  }).then(data => {
    let imgAvatar;
    if (typeof data[0] != 'undefined' && data[0]) {
      imgAvatar = data[0].avatar;
    } else {
      imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
    }
    let responseJson = {
      id: data[0].userid,
      fullname: data[0].fullname,
      email: data[0].email,
      displayname: data[0].displayname,
      avatar: imgAvatar,
      token: 'temp token',
      authenticated: true
    };
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(responseJson));
    window.location = "/";

  }).catch(function (e) {
    console.log('Error got: ' + e);
  });

}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function callSimLoginApi(corpid, callback) {

  if (!corpid || corpid === '') {
    return callback(new Error('Please enter ID and Team'));
  }

  //team = team.toUpperCase();

  let userJson = {
    loginid: corpid,
    fullname: 'no fullanme',
    email: corpid + "@corpdev.ha.org.hk",
    displayname: "Tester: " + "corpid",
    team: 'team',
    role: 'role',
    imgAvatar: "",
    token: "testToken",
    authenticated: true
  };

  getUserInfo(userJson);

  return callback(null);


}