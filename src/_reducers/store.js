//import { createStore, applyMiddleware, combineReducers } from 'redux';
//import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import userReducer from './userReducer';
import requestReducer from './request.reducer';
//import bundleReducer from './bundle.reducer';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../_sagas'

const sagaMiddleware = createSagaMiddleware()
/*
const store = createStore(combineReducers({userReducer,}), 
        {}, 
        applyMiddleware(thunk, logger)
);
*/

// Creates the Redux store using our reducer and the logger and saga middlewares
const store = createStore(combineReducers({ userReducer, requestReducer }), applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(rootSaga)

export default store;