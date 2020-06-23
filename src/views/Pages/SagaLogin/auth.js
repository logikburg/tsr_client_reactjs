//import request from './fakeRequest'
import request from './realRequest'
import { sysConfig } from "../../../_config";
import axios from 'axios';
import _ from 'lodash'
/*
let localStorage

// If we're testing, use a local storage polyfill
if (global.process && process.env.NODE_ENV === 'test') {
  localStorage = require('localStorage')
} else {
  // If not, use the browser one
  localStorage = global.window.localStorage
}
*/
const auth = {
  /**
  * Logs a user in, returning a promise with `true` when done
  * @param  {string} username The username of the user
  * @param  {string} password The password of the user
  */
  simlogin(corpid, role) {
    try {
      console.log('corpid: ', corpid)

      if ((!corpid) || (corpid.length == 0) || (corpid.indexOf(".") >= 0) || (corpid.indexOf("/") >= 0) || (corpid.indexOf("\\") >= 0) || (corpid.indexOf("=") >= 0)) {
        let error
        error = new Error('User not found')
        return Promise.reject(error)
      }
      var url = sysConfig.API_TEST_PREFIX + '/user_profiles/' + corpid;
      //console.log('url: ' + url);

      return axios.get(url)
        .then((response) => {
          // handle success
          //console.log('response: ' + JSON.stringify(response));
          if (response.data) {
            //console.log(response.data);
            //this.setState({ bundles: response.data.bundles });
            let imgAvatar;
            let responseJson
            if (!_.isEmpty(response.data)) {
              // console.log("Found Avatar");
              imgAvatar = response.data.avatar;
              if (!imgAvatar) {
                console.log("No Avatar");
                imgAvatar = 'assets/img/avatars/0.jpg';
              }

              responseJson = {
                id: corpid,
                fullname: response.data.fullname,
                email: response.data.email,
                displayname: response.data.displayname,
                avatar: imgAvatar,
                token: 'temp token',
                authenticated: true,
                member_of: response.data.member_of,
                phone_number: response.data.phone_number
              };

              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('user', JSON.stringify(responseJson));
              var userTest = localStorage.getItem('user');
              // console.log('LocalStorage: ', userTest)
              //window.location = "/";
              return Promise.resolve(userTest);

            } else {
              console.log("No Avatar");
              /*
              imgAvatar = 'assets/img/avatars/' + random(0, 9) + '.jpg';
              responseJson = {
                id: corpid,
                fullname: 'fullname not found',
                email: 'email not found',
                displayname: 'displayname not found',
                avatar: imgAvatar,
                token: 'temp token',
                authenticated: true
                */
              let error
              error = new Error('User doesn\'t exist')
              return Promise.reject(error)
            };

          }

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          //localStorage.setItem('user', JSON.stringify(responseJson));
          //var userTest = localStorage.getItem('user');
          //console.log('LocalStorage: ', userTest)
          //window.location = "/";
          //return Promise.resolve(true);

        })
        .catch(function (error) {
          // handle error
          console.log('Err Catch: ', error);
          return Promise.reject(error)
        })



    } catch (error) {
      console.log('Auth Error: ', error)
      return Promise.reject('Cannot login')
    }
    // Post a fake request
  },
  login(corpid, password) {
    try {

      // Nodejs encryption with CTR
      const crypto = require('crypto');
      const algorithm = 'aes-256-cbc';
      const keyStr = 'THR8Yrrc4IyFE1iyefy0rpZjHgwnNolcqiSuv1MjUPY=';  //crypto.randomBytes(32);
      let buff = new Buffer(keyStr, 'base64');
      //let key = buff.toString('ascii');
      //let key = crypto.randomBytes(32);
      //let enKey = key.toString('hex');
      let key = Buffer.from('43d819b013319fa2f64f67128392b22bca09bbb1e0e73d87459f784e1ec6ff65', 'hex')

      //const ivStr = 'ttkL/DfsleX6 hNyb6285nQ=='; //const iv = crypto.randomBytes(16);
      //let ivBuff = new Buffer(ivStr, 'base64');
      //let iv = ivBuff.toString('ascii');
      //let iv = crypto.randomBytes(16);
      //let enIV = iv.toString('hex');
      let iv = Buffer.from('fd96ceb33b90a1b8b4d3bc26b93ad265', 'hex')

      function encrypt(text) {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        //return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
        return encrypted.toString('hex');
      }

      function decrypt(text) {
        //let iv = Buffer.from(text.iv, 'hex');
        //let encryptedText = Buffer.from(text.encryptedData, 'hex');
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
      }

      var thisTime = new Date().getTime();
      var strTimer = thisTime.toString();
      var hw = encrypt(password + strTimer.substring(strTimer.length - 6, strTimer.length));
      var encID = encrypt(corpid + strTimer.substring(strTimer.length - 6, strTimer.length));
      //let hwBuff = new Buffer(hw.toString());
      //var strHw = hwBuff.toString('base64');
      //Back
      //let buffBack = new Buffer(strHw, 'base64');
      //let textBack = buffBack.toString('ascii');

      //var decryPW = decrypt(hw);
      //var htmlEncode = require('htmlencode').htmlEncode;
      //var encryPW = htmlEncode(hw);
      //console.log('key: ' + key)
      //console.log('encry: ' + hw)
      //console.log('org: ' + decrypt(hw))


      //http://o1-itsm-app1/dbsAccess/dbUser.asmx/CheckUserToString
      //http://itsm-app1/dbsAccess/dbUser.asmx/CheckUserToString

      //var url = sysConfig.API_TEST_PREFIX + '/tsr/user/getUserV1/' + corpid;
      //var url = "http://itsm-app1/dbsAccess/dbUser.asmx/CheckUserToString";
      //console.log('url: ' + url);

      var requestOptions = (method, contentType, data) => {
        return {
          method: method,
          headers: new Headers({
            'Content-Type': contentType, // <-- Specifying the Content-Type
            'Accept': 'application/json'
          }),
          body: data, // <-- Post parameters
          //mode: 'cors'
        };
      }
      //http://160.89.55.38/dbsAccess/dbUser.asmx/CheckUserToString
      //http://t1-chrischin:4000/login
      var url = sysConfig.API_TEST_PREFIX + '/login/loginLDAP';
      //var url = 'http://t1-chrischin:4000/login';
      console.log("Login**:")

      return fetch(url, requestOptions("post", 'application/x-www-form-urlencoded', 'eqi=' + encID + '&equ=' + hw))
        .then(response => {
          return response.json();
        })
        .then(user => {
          //var user_id = user["loginid"]; //By login
          var user_id = user["sAMAccountName"]; //By logiuLDAP
          var user_token = user["token"]; //By logiuLDAP
          var user_displayname = user["displayName"]; //By logiuLDAP
          var user_mail = user["mail"]; //By logiuLDAP
          var user_fullname = user["decription"];

          console.log('RAW user: ' + JSON.stringify(user));
          console.log('user ID: ' + user_id);
          // login successful if there's a jwt token in the response
          //if (user && user.token) {
          if (user) {
            //getUserInfo(user)
            var url = sysConfig.API_TEST_PREFIX + '/tsr/user/getUserV1/' + user_id;
            //var url = sysConfig.API_TEST_PREFIX + '/login/user/getUserV1/' + user["loginid"];
            console.log('before: ' + url);
            return axios.get(url)
              .then((response) => {
                console.log('PassOK, response: ' + JSON.stringify(response));
                if (response.data) {
                  //console.log('** response.data: ', response.data);
                  //this.setState({ bundles: response.data.bundles });
                  let imgAvatar;
                  let responseJson
                  if (typeof response.data[0] != 'undefined' && response.data[0]) {
                    console.log("Found User");
                    imgAvatar = response.data[0].avatar;
                    if (!imgAvatar) {
                      console.log("No Avatar");
                      imgAvatar = 'assets/img/avatars/0.jpg';
                    }

                    responseJson = {
                      id: corpid,
                      fullname: user_fullname, //response.data[0].fullname,
                      email: user_mail, //response.data[0].email,
                      displayname: user_displayname, //response.data[0].displayname,
                      avatar: imgAvatar,
                      token: user_token,
                      authenticated: true,
                      member_of: response.data[0].member_of
                    };

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(responseJson));
                    var userTest = localStorage.getItem('user');
                    console.log('LocalStorage: ', userTest)
                    //window.location = "/";
                    return Promise.resolve(userTest);

                  } else {
                    console.log("No Avatar");

                    let error
                    error = new Error('User doesn\'t exist')
                    return Promise.reject(error)
                  };

                }
              });
          }
          else {
            //return callback(new Error('Wrong ID or password'));
            return Promise.reject('User not registered')
          }
          //return callback(null);
        })
        .catch(function (e) {
          console.log('Error got: ' + e);
          return Promise.reject('No user or Wrong password!')
        });

    } catch (error) {
      console.log('Auth Error: ', error)
      return Promise.reject('Cannot login')
    }
    // Post a fake request

  },

  /**
  * Logs the current user out
  */
  logout() {
    //return request.post('/logout')
    localStorage.removeItem('user');

    return true;
  },
  /**
  * Checks if a user is logged in
  */
  loggedIn() {
    var user = localStorage.getItem('user');
    var isLogged = false;
    /*
    if (user) {
      user = JSON.parse(user);
      if (user.token !== '') {
        isLogged = true;
      }
    }*/
    if (user) {
      isLogged = true;
    }
    return isLogged;
  },
  /**
  * Registers a user and then logs them in
  * @param  {string} username The username of the user
  * @param  {string} password The password of the user
  */
  register(username, password) {
    // Post a fake request
    return request.post('/register', { username, password })
      // Log user in after registering
      .then(() => auth.login(username, password))
  },
  onChange() { }
}

export default auth