import defaultData from "../views/Request/dfConfig_";
import defaultStages from "../views/Request/wfConfig_";
import {
  CONFIG_LIST_UI_LOAD_SUCCESS,
  BUNDLE_LIST_DATA_LOAD_PENDING,
  BUNDLE_LIST_DATA_LOAD_SUCCESS,
  BUNDLE_LIST_DATA_LOAD_ERROR,
  PACKAGE_UI_LOAD_PENDING,
  PACKAGE_UI_LOAD_SUCCESS,
  PACKAGE_UI_LOAD_ERROR,
  BUNDLE_DATA_LOAD_PENDING,
  BUNDLE_DATA_LOAD_SUCCESS,
  BUNDLE_DATA_LOAD_ERROR,
  REQUEST_UPDATE,
  SUBMIT_REQUEST,
  INIT_DATA,
  APPROVE_STAGE,
  REQUEST_SAVE_SUCCESS,
  UPDATE_STAGE_SUPPORT,
  UPDATE_FIREWALL_REQUEST_DATA
} from '../_actions/request.action';
//import _ from "lodash";

const initState = JSON.parse(JSON.stringify({
  pendingServices: [],
  data: [],
  history: {},
  configRequestUI: [],
  configBundleUI: [],
  updated: false,
  loadedUI: false
}));


export default function requestReducer(state = initState, action) {
  switch (action.type) {
    case CONFIG_LIST_UI_LOAD_SUCCESS:
      console.log("CONFIG_LIST_UI_LOAD_SUCCESS", action);
      let tmpState = JSON.parse(JSON.stringify(state));
      tmpState.configRequestUI = action.data.configRequestUI;
      tmpState.configBundleUI = action.data.configBundleUI;
      tmpState.others = action.data.others;
      tmpState.loadedUI = true;
      if (state.updated == false) {
        console.log("INIT_DATA is not yet called as updated is [", state.updated, "]");
      }
      return tmpState;
    case INIT_DATA:
      console.log("INIT_DATA", action);
      if (state.loadedUI == false) {
        console.log("CONFIG_LIST_UI_LOAD_SUCCESS is not yet called as loadedUI is [", state.loadedUI, "]");
        return state;
      }
      let initState = JSON.parse(JSON.stringify(state));
      let configBundleUI = initState.configBundleUI;
      let configRequestUI = initState.configRequestUI;
      let dataServices = {};
      let dataDefault = {};
      let uiServices = {};
      let stages = {};
      let packageType = action.packageType;
      let bundle = configBundleUI.filter(bundle => bundle._id === packageType)[0];
      if (bundle && bundle["services"] && (bundle["services"].length > 0)) {
        if (!dataServices[packageType]) {
          dataServices[packageType] = {};
          dataDefault[packageType] = {};
          uiServices[packageType] = [];
        }
        for (let service of bundle["services"]) {
          let srv = configRequestUI.filter(request => request._id === service.name)[0];
          uiServices[packageType].push(srv);
          let serviceName = srv._id;
          let obj = {};
          let fields = srv.details.map(data => data.field);
          for (let fld of fields) {
            obj[fld] = "";
          }
          if (!dataServices[packageType][serviceName]) {
            dataServices[packageType][serviceName] = { data: [], stage: [] };
            dataDefault[packageType][serviceName] = { data: [obj], stage: srv.workflows };
          }
        }
      } else {
        let srv = configRequestUI.filter(request => request._id === packageType)[0];
        if (srv !== undefined) {
          if (!dataServices[packageType]) {
            dataServices[packageType] = {};
            dataDefault[packageType] = {};
            uiServices[packageType] = [];
          }
          uiServices[packageType].push(srv);
          let serviceName = srv._id;
          let obj = {};
          let fields = srv.details.map(data => data.field);
          for (let fld of fields) {
            obj[fld] = "";
          }
          if (!dataServices[packageType][serviceName]) {
            dataServices[packageType][serviceName] = { data: [], stage: [] };
            dataDefault[packageType][serviceName] = { data: [obj], stage: srv.workflows };
          }
        }
      }
      console.log("dataServices", dataServices, "dataDefault", dataDefault);
      console.log({
        ...state,
        dataServices: dataServices,
        dataDefault: dataDefault,
        uiServices: uiServices,
        updated: true
      });
      return {
        ...state,
        dataServices: dataServices,
        dataDefault: dataDefault,
        uiServices: uiServices,
        packageType: packageType,
        updated: true
      };
    // case PACKAGE_UI_LOAD_PENDING:
    //   return state;
    // case PACKAGE_UI_LOAD_SUCCESS:
    //   let data = JSON.parse(JSON.stringify(action.ui));
    //   let uiServices = [{}];
    //   if (data.status) {
    //     uiServices = data.uiServices;
    //   }
    //   return { ...state, ui: uiServices };
    case PACKAGE_UI_LOAD_ERROR:
      return { ...state, error: action.error };
    case BUNDLE_DATA_LOAD_PENDING:
      return state;
    case BUNDLE_LIST_DATA_LOAD_PENDING:
      return state;
    case BUNDLE_LIST_DATA_LOAD_SUCCESS:
      let list_data = JSON.parse(JSON.stringify(action.data));
      let bundleData = [];
      let pendingServices = [];
      if (list_data.status) {
        bundleData = list_data.bundles;
      }
      if (list_data.pendingServices) {
        pendingServices = list_data.pendingServices;
      }
      return { ...state, bundleData: bundleData, pendingServices: pendingServices }
    case BUNDLE_LIST_DATA_LOAD_ERROR:
      return { ...state, error: action.error };
    // -------
    case BUNDLE_DATA_LOAD_SUCCESS:
      return { ...state, dataServices: action.data.dataServices, history: action.data.history }
    case BUNDLE_DATA_LOAD_ERROR:
      return { ...state, error: action.error };
    case REQUEST_SAVE_SUCCESS:
      let reqSaveState = JSON.parse(JSON.stringify(state));
      let saveData = action.data.data;
      let tmpData = {
        displayname: saveData.displayname,
        ...saveData.service_data,
        status: "saved",
        _id: saveData._id,
        submittedBy: saveData.submittedBy,
        service_name: saveData.service_name,
        date: saveData.date
      }
      if (reqSaveState.dataServices[saveData.bundle_type][saveData.service_type] === undefined) {
        reqSaveState.dataServices[saveData.bundle_type][saveData.service_type] = {}
        reqSaveState.dataServices[saveData.bundle_type][saveData.service_type].data = [];
        reqSaveState.dataServices[saveData.bundle_type][saveData.service_type].stage = [];
      }

      reqSaveState.dataServices[saveData.bundle_type][saveData.service_type].data.push(tmpData);
      reqSaveState.dataServices[saveData.bundle_type][saveData.service_type].stage.push(action.data.wf);
      return reqSaveState;
    case SUBMIT_REQUEST:
      let reqSubmitState = JSON.parse(JSON.stringify(state));
      let curStages = reqSubmitState.dataServices[action.payload.bundle_type][action.payload.serviceName].stage[action.payload.rowIndex]
      let history1 = JSON.parse(JSON.stringify(state.history));
      if (!history1[action.payload.rowValues._id]) {
        history1[action.payload.rowValues._id] = [];
      }
      history1[action.payload.rowValues._id].push({
        service_id: action.payload.rowValues._id,
        user: action.payload.user,
        date: action.payload.rowValues.date,
        displayname: action.payload.rowValues.displayname,
        action: "submit",
        comment: "submit Request",
        _id: action.payload.rowValues._id
      })
      curStages.forEach((item, i) => {
        if (item.stage_id === 0) {
          item.status = "approved";
          item.displayname = action.payload.rowValues.displayname;
          item.approverName = action.payload.rowValues.displayname;
          item.approvedBy = action.payload.rowValues.displayname
          item.updated_date = action.payload.rowValues.date
        }
        if (item.stage_id === 1) {
          item.status = "pending";
        }
      });
      reqSubmitState.dataServices[action.payload.bundle_type][action.payload.serviceName]["stage"][action.payload.rowIndex] = curStages
      reqSubmitState.dataServices[action.payload.bundle_type][action.payload.serviceName]["data"][action.payload.rowIndex] = action.payload.rowValues;
      reqSubmitState.dataServices[action.payload.bundle_type][action.payload.serviceName]["data"][action.payload.rowIndex].status = "inprogress";
      reqSubmitState.history = history1;
      return reqSubmitState;
    case REQUEST_UPDATE:
      let updateState = JSON.parse(JSON.stringify(state));
      let dataTmp = action.data.data;//updateState.dataDefault[action.data.packageType][action.data.service]["data"][0];
      let stageTmp = updateState.dataDefault[action.data.packageType][action.data.service]["stage"];
      switch (action.actionType) {
        case "save_to_db":
        case "save":
        case "add":
          updateState.dataServices[action.data.packageType][action.data.service]["data"].push(dataTmp);
          updateState.dataServices[action.data.packageType][action.data.service]["stage"].push(stageTmp);
          return updateState;
        case "remove":
          updateState.dataServices[action.data.packageType][action.data.service]["data"].splice(action.index, 1);
          updateState.dataServices[action.data.packageType][action.data.service]["stage"].splice(action.index, 1);
          return updateState;
        case "update":
        case "update_in_db":
          updateState.dataServices[action.data.packageType][action.data.service]["data"].splice(action.index, 1, action.data.data);
          return updateState;
        default:
          return state;
      }
    case APPROVE_STAGE:
      const actionDone = action.payload.comment.action;
      let history = JSON.parse(JSON.stringify(state.history));
      if (!history[action.serviceInfo.service_id]) {
        history[action.serviceInfo.service_id] = [];
      }
      let historyRecord = {
        ...action.payload.comment,
        service_id: action.serviceInfo.service_id,
        user: action.payload.approvedBy,
        displayname: action.payload.displayname,
        date: action.payload.approvalDate
      }
      if (historyRecord.action === "complete") {
        let tmp = { ...historyRecord, action: "handle" }
        history[action.serviceInfo.service_id].push(tmp);
      }
      history[action.serviceInfo.service_id].push(historyRecord);
      switch (actionDone) {
        case "comment":
        case "assign":
          return { ...state, history: history };
        default:
          let approveState = JSON.parse(JSON.stringify(state));
          let tmpStages = approveState.dataServices[action.serviceInfo.bundle_type][action.serviceInfo.service_name]["stage"][action.serviceInfo.rowIndex];
          let tmpSrv = "";
          let tmpPendingServices = JSON.parse(JSON.stringify(state.pendingServices));
          let ps = tmpPendingServices.filter(value => {
            return value !== action.serviceInfo.service_id;
          });
          tmpStages.forEach(item => {
            if (item._id === action.payload.approved_id) {
              item.status = "approved";
              item.approvedBy = action.payload.approvedBy;
              item.updated_date = action.payload.approvalDate;
              item.approverName = action.payload.displayname;
              //item.displayname = action.payload.displayname;
            }
            if (item._id === action.payload.pending_id || item._id === action.payload.other_id) {
              tmpSrv = item.service_id;
              if (item.stage_name === "completed") {
                item.status = "completed";
              } else {
                item.status = "pending";
              }
              item.approvedBy = action.payload.approvedBy;
              item.updated_date = action.payload.approvalDate;
              item.approverName = action.payload.displayname;
              // item.displayname = action.payload.displayname;
            }
            if (item._id === action.payload.withdrawn_id) {
              tmpSrv = item.service_id;
              item.status = actionDone;//"withdrawn";
            }
          });
          if (actionDone === "rejected" || actionDone === "withdrawn" || actionDone === "complete") {
            approveState.dataServices[action.serviceInfo.bundle_type][action.serviceInfo.service_name]["data"][action.serviceInfo.rowIndex].status = actionDone;//"withdrawn";
            //ps.push(tmpSrv)
          }

          approveState.dataServices[action.serviceInfo.bundle_type][action.serviceInfo.service_name]["stage"][action.serviceInfo.rowIndex] = tmpStages;
          return { ...approveState, pendingServices: ps, history: history };
      }
    case UPDATE_STAGE_SUPPORT:
      let update_stage_state = JSON.parse(JSON.stringify(state));
      const package_type = update_stage_state.packageType;
      const service_type = action.stage[0].service_type;
      let _stags = update_stage_state.dataServices[package_type][service_type].stage[action.rowIndex];
      const cur = _stags.filter(step => step.status === 'pending');
      cur[0][action.assignTo] = action.payload[action.assignTo];
      return { ...update_stage_state };
    case UPDATE_FIREWALL_REQUEST_DATA:
      let update_firewall_state = JSON.parse(JSON.stringify(state));
      let _data = action.data;
      update_firewall_state.dataServices[update_firewall_state.packageType]['firewall'].data.forEach((_el) => {
        _el.hosts = _data;
      });
      return { ...update_firewall_state };
    default:
      return state;
  }
}