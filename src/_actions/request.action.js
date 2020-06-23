// ui
export const CONFIG_LIST_UI_LOAD_SUCCESS = 'CONFIG_LIST_UI_LOAD_SUCCESS';
export const CONFIG_LIST_UI_LOAD_PENDING = 'CONFIG_LIST_UI_LOAD_PENDING';
export const CONFIG_LIST_UI_LOAD_ERROR = 'CONFIG_LIST_UI_LOAD_ERROR';

export const PACKAGE_UI_LOAD_PENDING = 'PACKAGE_UI_LOAD_PENDING';
export const PACKAGE_UI_LOAD_SUCCESS = 'PACKAGE_UI_LOAD_SUCCESS';
export const PACKAGE_UI_LOAD_ERROR = 'PACKAGE_UI_LOAD_ERROR';

// data
export const BUNDLE_DATA_LOAD_PENDING = 'BUNDLE_DATA_LOAD_PENDING';
export const BUNDLE_DATA_LOAD_SUCCESS = 'BUNDLE_DATA_LOAD_SUCCESS';
export const BUNDLE_DATA_LOAD_ERROR = 'BUNDLE_DATA_LOAD_ERROR';

export const BUNDLE_LIST_DATA_LOAD_PENDING = 'BUNDLE_LIST_DATA_LOAD_PENDING';
export const BUNDLE_LIST_DATA_LOAD_SUCCESS = 'BUNDLE_LIST_DATA_LOAD_SUCCESS';
export const BUNDLE_LIST_DATA_LOAD_ERROR = 'BUNDLE_LIST_DATA_LOAD_ERROR';

export const REQUEST_SAVE_SUCCESS = 'REQUEST_SAVE_SUCCESS';
export const REQUEST_SUBMIT_SUCCESS = "REQUEST_SUBMIT_SUCCESS";

export const SUBMIT_BUNDLE = 'SUBMIT_BUNDLE';
export const REQUEST_UPDATE = 'REQUEST_UPDATE';
export const INIT_DATA = 'INIT_DATA';
export const APPROVE_STAGE = 'APPROVE_STAGE';
export const UPDATE_STATUS = 'UPDATE_STATUS';
export const SAVE_REQUEST = "SAVE_REQUEST";
export const SUBMIT_REQUEST = "SUBMIT_REQUEST";
export const DEL_BUNDLE = 'DEL_BUNDLE';
export const UPDATE_STAGE_SUPPORT = 'UPDATE_STAGE_SUPPORT';

export const UPDATE_FIREWALL_REQUEST_DATA = 'UPDATE_FIREWALL_REQUEST_DATA';

export const getConfigListUILoaded = (data) => ({
  type: CONFIG_LIST_UI_LOAD_SUCCESS,
  data
});

export const getConfigListUILoading = () => ({
  type: CONFIG_LIST_UI_LOAD_PENDING
});

export const getConfigListUIError = (error) => ({
  type: CONFIG_LIST_UI_LOAD_ERROR,
  error
});

export const setBundleListDataLoading = (status, payload) => ({
  type: BUNDLE_LIST_DATA_LOAD_PENDING,
  status,
  payload
})

export const delBundle = (payload) => ({
  type: DEL_BUNDLE,
  payload
})

export const updateStageSupport = (payload, stage, rowIndex, assignTo) => ({
  type: UPDATE_STAGE_SUPPORT,
  stage,
  payload,
  rowIndex,
  assignTo
})

export const submitRequestData = (payload) => ({
  type: SUBMIT_REQUEST,
  payload
})

export const saveRequestData = (payload) => ({
  type: SAVE_REQUEST,
  payload
})

export const setBundleListDataLoaded = (status, data) => ({
  type: BUNDLE_LIST_DATA_LOAD_SUCCESS,
  status,
  data
})

export const setBundleListDataError = (error) => ({
  type: BUNDLE_LIST_DATA_LOAD_ERROR,
  error
})

export const updateStatusBundle = (payload) => ({
  type: UPDATE_STATUS,
  payload
})

export const approveStage = (serviceInfo, payload) => ({
  type: APPROVE_STAGE,
  serviceInfo,
  payload
})

export const submitBundle = (payload) => ({
  type: SUBMIT_BUNDLE,
  payload
})

export const setInitData = (packageType) => ({
  type: INIT_DATA,
  packageType
})
//---ui
export const setPackageUILoading = (formType) => ({
  type: PACKAGE_UI_LOAD_PENDING,
  formType
})

export const setPackageUILoaded = (formType, ui) => ({
  type: PACKAGE_UI_LOAD_SUCCESS,
  ui,
  formType
});


export const setPackageUIError = (error) => ({
  type: PACKAGE_UI_LOAD_ERROR,
  error
});

//---data
export const setBundleDataLoading = (bundleID) => ({
  type: BUNDLE_DATA_LOAD_PENDING,
  bundleID
});

export const setBundleDataLoaded = (bundleID, data) => ({
  type: BUNDLE_DATA_LOAD_SUCCESS,
  data,
  bundleID
});

export const setBundleDataError = (error) => ({
  type: BUNDLE_DATA_LOAD_ERROR,
  error
});

export const updateRequestData = (actionType, data, index) => ({
  type: REQUEST_UPDATE,
  actionType,
  data,
  index
});

export const saveRequestSuccess = (data) => ({
  type: REQUEST_SAVE_SUCCESS,
  data
});

export const submitRequestSuccess = (data) => ({
  type: REQUEST_SUBMIT_SUCCESS,
  data
});

export const updateFirewallRequestData = (data) => ({
  type: UPDATE_FIREWALL_REQUEST_DATA,
  data
});