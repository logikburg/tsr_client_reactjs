/**
* Real XMLHttpRequest wrapper
*/

//import server from './fakeServer'
//server.init()

import { callSagaLogin } from '../../../_actions/login.actions'
import { callSimLoginApi } from '../../../_actions/simlogin.actions'

const realRequest = {
  /**
  * Pretends to post to a remote server
  * @param  {string}  endpoint The endpoint of the server that should be contacted
  * @param  {?object} data     The data that should be transferred to the server
  */
  post(endpoint, data) {
    switch (endpoint) {
      case '/login':
        //return server.login(data.username, data.password)
        //return callSagaLogin(data.username, data.password)
        return callSimLoginApi(data.corpid, data.team, data.role)

      //case '/register':
      //  return server.register(data.username, data.password)
      case '/logout':
        //  return server.logout()
        return new Promise(resolve => {
          localStorage.removeItem('user');
          resolve(true)
        })

      default:
        break
    }
  }
}

export default realRequest