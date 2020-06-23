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
    callLoginApi(username, password, error => {
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

function getUserSession(user) {
  return fetch(sysConfig.API_TEST_PREFIX + '/raw/v1-dat-usersessions/search',
    {
      /*method:'GET'*/

      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        //'Access-Control-Allow-Origin': '*',
        //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json; charset=utf-8',
        'Origin': window.location.origin,
        'TSRAuth': "xlNIOEWONXVLSDFOiuLSKNLIUAD",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify(
        {
          criteria: {
            loginid: user.loginid
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
      alert("Fail to login");
    }
    //this.updateLoadingState(true);
    return response.json();
  }).then(data => {
    console.log("Checking Session ...");

    let responseJson = {};
    if (typeof data[0] != 'undefined' && data[0]) {
      responseJson = {
        loginid: data[0].loginid,
        fullname: data[0].fullname,
        email: data[0].email,
        displayname: data[0].displayname,
        avatar: "",
        token: data[0].token,
        authenticated: data[0].authenticated
      };
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //localStorage.setItem('user', JSON.stringify(responseJson));

    } else {
      Promise.reject('No Session');
    }

    return responseJson;

  }).then(user => {
    return getUserInfo(user);
  });

}

function getUserInfo(user) {
  return fetch(sysConfig.API_TEST_PREFIX + '/raw/userprofile/search',
    {
      /*method:'GET'*/

      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        //'Access-Control-Allow-Origin': '*',
        //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
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
      alert("Fail to login");
    }
    //this.updateLoadingState(true);
    return response.json();
  }).then(data => {
    console.log("loging in ...");

    let imgAvatar;
    if (typeof data[0] != 'undefined' && data[0]) {
      console.log("Found Avatar");
      imgAvatar = data[0].avatar;
    } else {
      console.log("No Avatar");
      imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
    }
    let responseJson = {
      id: user.loginid,
      fullname: user.fullname,
      email: user.email,
      displayname: user.displayname,
      avatar: imgAvatar,
      token: user.token,
      authenticated: true
    };
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('user', JSON.stringify(responseJson));
    var userTest = localStorage.getItem('user');
    console.log('LocalStorage: ', userTest)

    return new Promise((resolve, reject) => {
      // If the user exists and the password fits log the user in and resolve
      if (responseJson) {
        resolve(responseJson)
      } else {
        // Set the appropiate error and reject
        let error
        error = new Error('Wrong ID or Password')
        reject(error)
      }
    })
    //window.location = "/";
    //console.log('localStorage:', localStorage)
  });

}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function callLoginApi_org(username, password, callback) {
  /*
  setTimeout(() => {
    if (username === 'admin@example.com' && password === 'admin') {
      return callback(null);
    } else {
      return callback(new Error('Invalid email and password'));
    }
  }, 1000);
*/

  var requestOptions = (method, contentType, data) => {
    return {
      method: method,
      headers: new Headers({
        'Content-Type': contentType, // <-- Specifying the Content-Type
        'Accept': 'application/json'
      }),
      body: data, // <-- Post parameters
      mode: 'cors'
    };
  }
  //http://160.89.55.38/dbsAccess/dbUser.asmx/CheckUserToString
  //http://o1-pc-chrischin:4000/login
  fetch('http://localhost:4000/login', requestOptions("post", 'application/x-www-form-urlencoded', 'user=' + username + '&password=' + password + '&domain=corp'))
    .then(response => {
      //
      console.log('RAW Response: ' + JSON.stringify(response));
      if (!response.authenticated) {
        console.log('No Okay!: ' + JSON.stringify(response));
        return Promise.reject(response.statusText);
      }
      console.log('Response: ' + JSON.stringify(response));
      //

      if (response.status !== 200) {
        Promise.reject('Unauthorised');
        //alert("Fail to login");
        //this.updateLoadingState(true);
        return "";
      }

      return response.json();
    })
    .then(user => {
      console.log('RAW user: ' + JSON.stringify(user));
      // login successful if there's a jwt token in the response
      //if (user && user.token) {
      if (user) {
        getUserInfo(user)
      }
      else {
        return callback(new Error('Wrong ID or password'));
      }
      return callback(null);
    })
    .catch(function (e) {
      console.log('Error got: ' + e);
    });
}


export function callLoginApi(username, password, callback) {
  /*
  setTimeout(() => {
    if (username === 'admin@example.com' && password === 'admin') {
      return callback(null);
    } else {
      return callback(new Error('Invalid email and password'));
    }
  }, 1000);
*/

  var requestOptions = (method, contentType, data) => {
    return {
      method: method,
      headers: new Headers({
        'Content-Type': contentType, // <-- Specifying the Content-Type
        'Accept': 'application/json'
      }),
      body: data, // <-- Post parameters
      mode: 'cors'
    };
  }
  //http://160.89.55.38/dbsAccess/dbUser.asmx/CheckUserToString
  //http://o1-pc-chrischin:4000/login
  fetch('http://t1-chrischin:4000/login', requestOptions("post", 'application/x-www-form-urlencoded', 'user=' + username + '&password=' + password + '&domain=corp'))
    .then(response => {
      //
      console.log('RAW Response: ' + response);
      /*
      if (!response.authenticated) {
        console.log('No Okay!: ' + JSON.stringify(response));
        return Promise.reject(response.statusText);
      }
      */
      if (response.statusText !== 'OK') {
        return Promise.reject(response);
      }
      console.log('Response: ' + JSON.stringify(response));
      //

      if (response.status !== 200) {
        Promise.reject('Unauthorised');
        //alert("Fail to login");
        //this.updateLoadingState(true);
        return "";
      }

      return response;
    })
    .then(user => {
      //console.log('RAW user: ' + JSON.stringify(user));
      console.log('find user session in DB: ' + username)
      // login successful if there's a jwt token in the response
      //if (user && user.token) {
      if (username) {
        //getUserInfo({ loginid: username, fullname: 'test user' })
        getUserSession({ loginid: username })

      }
      else {
        return callback(new Error('Wrong ID or password'));
      }
      return callback(null);
    })
    .catch(function (e) {
      console.log('Error got: ' + e);
      //return callback(new Error('Wrong ID or password'));
      // return { type: REQUEST_ERROR, e }
      Promise.reject('Login Failed');
    });
}


export function callSagaLogin(username, password, callback) {
  //console.log('pwd: ', password)
  /*
  setTimeout(() => {
    if (username === 'admin@example.com' && password === 'admin') {
      return callback(null);
    } else {
      return callback(new Error('Invalid email and password'));
    }
  }, 1000);
*/

  var requestOptions = (method, contentType, data) => {
    return {
      method: method,
      headers: new Headers({
        'Content-Type': contentType, // <-- Specifying the Content-Type
        'Accept': 'application/json'
      }),
      body: data, // <-- Post parameters
      mode: 'cors'
    };
  }
  //http://160.89.55.38/dbsAccess/dbUser.asmx/CheckUserToString
  //http://o1-pc-chrischin:4000/login
  return fetch('http://t1-chrischin:4000/login', requestOptions("post", 'application/x-www-form-urlencoded', 'user=' + username + '&password=' + password + '&domain=corp'))
    .then(response => {
      //
      //console.log('RAW Response: ' + JSON.stringify(response));
      response.json().then(user => {

        //return Promise.resolve(json);
        //return response;
        if (user && user.loginid && user.token) {
          //console.log('RAW user: ' + getUserSession({ loginid: user.loginid }));
          getUserSession({ loginid: user.loginid })

        }
        //console.log('test JSON: ', user);
        //return user;
        /*
        return new Promise((resolve, reject) => {
          // If the user exists and the password fits log the user in and resolve
          if (jsonUser) {
            resolve(jsonUser)

          } else {
            // Set the appropiate error and reject
            let error
            error = new Error('Wrong ID or Password')
            reject(error)
          }
        })*/
      })
      /*
      if (!response.authenticated) {
        console.log('No Okay!: ' + JSON.stringify(response));
        return Promise.reject(response.statusText);
      }
      */
      if (response.statusText !== 'OK') {
        //return Promise.reject(response);
        return Promise.reject(response);
      }
      //console.log('Response: ' + JSON.stringify(response));
      //

      if (response.status !== 200) {
        //Promise.reject('Unauthorised');
        //alert("Fail to login");
        //this.updateLoadingState(true);
        //return "";
        return Promise.reject("Unauthorized")
      }

      //return Promise.reject('No user found');
      return response;

    })
    .catch(function (e) {
      console.log('Error got: ' + e);
      //return callback(new Error('Wrong ID or password'));
      //return { type: REQUEST_ERROR, e }
      return Error('Wrong ID or password');
      //return Promise.reject('Login Failed');
    });
}

 /*
    .then(user => {
      console.log('RAW user: ' + user);
      console.log('find user session in DB: ' + username)
      // login successful if there's a jwt token in the response
      //if (user && user.token) {
      if (username) {
        //getUserInfo({ loginid: username, fullname: 'test user' })
        getUserSession({ loginid: username })

      }
      else {
        //return callback(new Error('Wrong ID or password'));
        return Promise.reject('Cannot get user session');
      }
      //return callback(null);
      //return user


      
            return Promise.resolve({
              authenticated: true,
              // Fake a random token
              token: Math.random().toString(36).substring(7)
            })
    })
    */