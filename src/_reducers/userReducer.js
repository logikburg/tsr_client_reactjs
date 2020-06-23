//import { userConstants } from '../_constants/user.constants';
/*
const SET_LOGIN_PENDING = userConstants.SET_LOGIN_PENDING;
const SET_LOGIN_SUCCESS = userConstants.SET_LOGIN_SUCCESS;
const SET_LOGIN_ERROR = userConstants.SET_LOGIN_ERROR;
*/
import {
  CHANGE_FORM,
  SET_AUTH,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR
} from '../views/Pages/SagaLogin/constants';
import auth from '../views/Pages/SagaLogin/auth'

/*
export default function userReducer(state = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: null
}, action) {
  switch (action.type) {
    case SET_LOGIN_PENDING:
      return Object.assign({}, state, {
        isLoginPending: action.isLoginPending
      });

    case SET_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoginSuccess: action.isLoginSuccess
      });

    case SET_LOGIN_ERROR:
      return Object.assign({}, state, {
        loginError: action.loginError
      });

    default:
      return state;
  }
}
*/
/*
export default function userReducer(state = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: null
}, action) {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, isLoginPending: action.isLoginPending }

    case SET_AUTH:
      return { ...state, isLoginSuccess: action.isLoginSuccess }

    case REQUEST_ERROR:
      return { ...state, loginError: action.loginError }

    default:
      return state;
  }
}
*/

// The initial application state
let initialState = {
  formState: {
    username: '',
    password: ''
  },
  error: '',
  currentlySending: false,
  loggedIn: auth.loggedIn()
}

// Takes care of changing the application state
function userReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return { ...state, formState: action.newFormState }
    case SET_AUTH:
      return { ...state, loggedIn: action.newAuthState }
    case SENDING_REQUEST:
      return { ...state, currentlySending: action.sending }
    case REQUEST_ERROR:
      return { ...state, error: action.error }
    case CLEAR_ERROR:
      return { ...state, error: '' }
    default:
      return state
  }
}

export default userReducer