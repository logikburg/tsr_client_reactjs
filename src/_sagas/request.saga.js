import { call, put, take } from 'redux-saga/effects'
import * as actions from '../_actions/request.action'
import axios from 'axios'
import { sysConfig } from "../_config";

function* getConfigListUI(action) {
  let type = action.formType;
  try {
    const data = yield call(axios, ({
      method: 'get',
      url: sysConfig.API_TEST_PREFIX + `/request/ui`,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    yield put(actions.getConfigListUILoaded(data.data));
  } catch (error) {
    yield put(actions.getConfigListUIError(error));
  }
}

export function* watchGetConfigListUI() {
  while (true) {
    const action = yield take(actions.CONFIG_LIST_UI_LOAD_PENDING);
    yield call(getConfigListUI, action);
  }
}

function* getUI(action) {
  let type = action.formType;
  try {
    const data = yield call(axios, ({
      method: 'get',
      url: sysConfig.API_TEST_PREFIX + `/ui/${type}`,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    yield put(actions.setPackageUILoaded(type, data.data));

  } catch (error) {
    yield put(actions.setPackageUIError(error));
  }
}

export function* watchPackageUILoad() {
  while (true) {
    const action = yield take(actions.PACKAGE_UI_LOAD_PENDING);
    yield call(getUI, action);
  }
}

function* getData(action) {
  let bundleID = action.bundleID;
  try {
    const data = yield call(axios, ({
      method: 'get',
      url: sysConfig.API_TEST_PREFIX + `/request/bundle/services/${bundleID}`,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    console.log("DATAAAAAA:", data);
    yield put(actions.setBundleDataLoaded(bundleID, data.data));
  } catch (error) {
    yield put(actions.setBundleDataError(error));
  }
}

export function* watchBundleDataLoad() {
  while (true) {
    const action = yield take(actions.BUNDLE_DATA_LOAD_PENDING);
    yield call(getData, action);
  }
}

function* submitBundle(action) {
  const payload = action.payload;
  console.log("=======>>>>>>>", payload.status);
  try {
    yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/new',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }))
  } catch (error) {
  }
  if (payload.status) {
    window.location = `/#/reqlist/${payload.status}`;
  }
}

export function* watchSubmitBundle() {
  while (true) {
    const action = yield take(actions.SUBMIT_BUNDLE);
    yield call(submitBundle, action);
  }
}

function* approveStage(action) {
  const payload = action.payload;
  try {
    console.log('*** approveStage(action)', action)
    const data = yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/approve',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    if (data.data.bundle_status && data.data.bundle_status === true) {
      window.location = `/#/reqlist/handled`;
    }
  } catch (error) {
  }
}

function* withdrawnStage(action) {
  const payload = action.payload;
  try {
    const data = yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/withdrawn',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }))
    if (data.data.bundle_status && data.data.bundle_status === true) {
      window.location = `/#/reqlist/withdrawn`;
    }
  } catch (error) {
  }
}

export function* watchApproveStage() {
  while (true) {
    const action = yield take(actions.APPROVE_STAGE);
    if (action.payload.comment.action === "rejected" || action.payload.comment.action === "withdrawn") {
      yield call(withdrawnStage, action);
    } else {
      yield call(approveStage, action);
    }
  }
}

function* updateStatusBundle(action) {
  const payload = action.payload;
  try {
    yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/bundle/status',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }

    }))
  } catch (error) {
  }
  if (payload.newStatus) {
    let status = payload.newStatus.substring(0, 2) === "to" ?
      payload.newStatus.substring(2) : payload.newStatus;
    window.location = `/#/reqlist/${status}`;
  }
}

export function* watchUpdateStatusBundle() {
  while (true) {
    const action = yield take(actions.UPDATE_STATUS);
    //console.log(action.payload);
    yield call(updateStatusBundle, action);
  }
}

function* getBundleListData(action) {
  let status = action.status;
  let payload = action.payload.user;
  try {
    const data = yield call(axios, ({
      method: 'get',
      url: sysConfig.API_TEST_PREFIX + `/request/list/${status}/${payload}`,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    yield put(actions.setBundleListDataLoaded(status, data.data));
  } catch (error) {
    yield put(actions.setBundleListDataError(error));
  }
}

export function* watchBundleListDataLoad() {
  while (true) {
    const action = yield take(actions.BUNDLE_LIST_DATA_LOAD_PENDING);
    yield call(getBundleListData, action);
  }
}

function* saveRequest(action) {
  const payload = action.payload;
  try {
    const data = yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/service/save/',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
    yield put(actions.saveRequestSuccess(data.data));
    if (payload.submit) {
      let newData = {
        ...payload.submit,
        rowValues: { ...data.data.data.service_data, ...data.data.data }
      };
      yield put(actions.submitRequestData(newData));
    }
  } catch (error) {
  }
}

export function* watchSaveRequest() {
  while (true) {
    const action = yield take(actions.SAVE_REQUEST);
    yield call(saveRequest, action);
  }
}

function* submitRequest(action) {
  const payload = action.payload;
  try {
    yield call(axios, ({
      method: 'post',
      url: sysConfig.API_TEST_PREFIX + '/request/service/submit/',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }

    }));
  } catch (error) {
  }
}

export function* watchSubmitRequest() {
  while (true) {
    const action = yield take(actions.SUBMIT_REQUEST);
    yield call(submitRequest, action);
  }
}

function* delBundle(action) {
  const payload = action.payload;
  try {
    yield call(axios, ({
      method: 'delete',
      url: sysConfig.API_TEST_PREFIX + `/request/bundle/${payload._id}`,
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
  } catch (error) {
  }
  window.location = `/#/reqlist/saved`;
}

export function* watchDelBundle() {
  while (true) {
    const action = yield take(actions.DEL_BUNDLE);
    yield call(delBundle, action);
  }
}

function* updateRequest(action) {
  const payload = action.data;
  let method = 'PUT';
  try {
    yield call(axios, ({
      method: method,
      url: sysConfig.API_TEST_PREFIX + '/request/service',
      data: payload,
      headers: { 'Content-Type': "application/json", 'pragma': 'no-cache' }
    }));
  } catch (error) {
  }
}

function* deleteRequest(action) {
  const payload = action.data;
  let method = 'delete';
  try {
    yield call(axios, ({
      method: method,
      url: sysConfig.API_TEST_PREFIX + `/request/service/`,//${payload.data._id}`,
      data: payload,
      headers: { 'Content-Type': "application/json", "pragma": 'no-cache' }
    }))
  } catch (error) {
  }
}

export function* watchUpdateRequest() {
  while (true) {
    const action = yield take(actions.REQUEST_UPDATE);
    if (action.actionType === "update_in_db") {
      yield call(updateRequest, action);
    } else if (action.actionType === "remove") {
      yield call(deleteRequest, action);
    }
  }
}

export function* watchUpdateStageSupport() {
  while (true) {
    const payload = yield take(actions.UPDATE_STAGE_SUPPORT);
    yield call(updateStageSupport, payload);
  }
}

function* updateStageSupport(data) {
  const payload = data.payload;
  const method = 'POST';
  try {
    yield call(axios, ({
      method: method,
      url: sysConfig.API_TEST_PREFIX + `/request/update/stage/support`,
      data: payload,
      headers: { 'Content-Type': "application/json", "pragma": 'no-cache' }
    }))
  } catch (error) {
  }
}

