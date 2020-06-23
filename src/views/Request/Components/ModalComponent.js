import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Collapse, Button, Row, Col, Modal, Label, Input, FormGroup, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink, } from 'reactstrap';
import Steps, { Step } from 'rc-steps';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { AgGridReact } from 'ag-grid-react';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import _ from "lodash";
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import moment from 'moment';

import { ModifiersUtils } from 'react-day-picker';
import {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';

//Firewall Form
import FirewallForm from './FirewallForm';

import LeaveCommentModal from './Modals/LeaveCommentModal';
import AssignSupervisorModal from './Modals/AssignSupervisorModal'
import ExtendedDateModal from './Modals/ExtendedDateModal';
import HandleRequestModal from './Modals/HandleRequestModal';
import AssignSupportModal from './Modals/AssignSupportModal';
import ActionCommentModal from './Modals/ActionCommentModal';

import { RequestStatus } from "../../../_constants"

import {
  updateStageSupport
} from "../../../_actions";
import AssignModal from './Modals/AssignModal';


//registerPlugin(FilePondPluginFileValidateSize);

const btnStyle = { marginRight: "5px", float: "right" };
const lclStyleCol = { paddingRight: "0px", paddingLeft: "15px", };
const lclStyleFormGroup = { border: "1px solid #c8ced3", padding: "8px", paddingTop: "15px", minWidth: "104px" };
const lclStyleFormGroupLabel = { marginBottom: "0px", position: "absolute", top: "-13px", background: "white" };

const defSupportGroup = ["T3Support", "T4Support", "SC3Support"];

const ASSIGN_SUPERVISOR = "AssignSupervisor"
const ASSIGN_SUPPORT = "AssignSupport"

class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    //console.log("props.rowValues", props.rowValues)
    this.state = {
      newValue: props.rowValues,
      activeTab: "1",
      collapse: false,
      comment: "",
      actionComment: "",
      isApprove: true,
      stepStatus: "wait",
      modalType: "",
      canSubmit: true,
      support: {}
    };

    //reference for child component(Firewall form)
    this.childRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.apply = this.apply.bind(this);
    this.submit = this.submit.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.toggleCommentBtn = this.toggleCommentBtn.bind(this);
    this.saveUpdates = this.saveUpdates.bind(this);
    this.closeValidationFailed = this.closeValidationFailed.bind(this);
    this.showModal = this.showModal.bind(this);
    this.addComment = this.addComment.bind(this);
    // this.applyAssignSupervisor = this.applyAssignSupervisor.bind(this);
    // this.applyAssignSupport = this.applyAssignSupport.bind(this);
    this.applyExtendedDate = this.applyExtendedDate.bind(this);
    this.updateStageSupport = this.updateStageSupport.bind(this);

    this.onRowUpdate = this.onRowUpdate.bind(this);

    //leave comment variables
    this.actionComment = "";
    this.comment = "";
    this.send_to_requester = false;
    this._dayPicker_ = null;

    // service detail variables
    this._sla = this.props.service.sla;

    this.vitalFields = [];
    if (this.props.others) {

      this._codes = [];
      if (this.props.others[0])
        this.props.others[0].code.forEach((e) => {
          this._codes.push(e.code);
        })

      this._env = [];
      if (this.props.others[2])
        this._env = this.props.others[2].values;

      this._templates = [];
      if (this.props.others[1])
        this._templates = this.props.others[1].template;

      this._pubHolidays = [];
      if (this.props.others[3])
        this._pubHolidays = this.props.others[3].values.map((v) => new Date(v));

      this.vitalFields = [{ editable: true, field: "target_date", headerName: "Target Date", cellEditor: "dayPickerInput", disabledDays: { values: this._pubHolidays }, sla: this._sla },
      { editable: true, field: "project_code", headerName: "Project Code", cellEditor: "agSelectCellEditor", cellEditorParams: { values: this._codes } },
      { editable: true, field: "environment", headerName: "Environment", cellEditor: "agSelectCellEditor", cellEditorParams: { values: this._env } },
      { editable: true, field: "purpose", headerName: "Purpose" },
      { editable: true, field: "phone_number", headerName: "Contact Phone Number" }
      ];
    }
  }


  onRowUpdate(actionType, srv, rowIndex, selectedData) {
    this.props.onRowUpdate(actionType, srv, rowIndex, selectedData);
    console.log("ModelComponent onRowUpdate", actionType, srv, rowIndex, selectedData);
  };


  componentDidMount() {
    let newState = {}
    let isReadOnly = !(this.props.rowValues["status"] === undefined || this.props.rowValues["status"] === "saved");
    let _is_other_input = this.props.stages.findIndex(step => {
      return (step.stage_name === "other_input" && step.status === "pending")
    });

    if (_is_other_input) isReadOnly = false;
    if (this.props.rowValues.status === "saved" || this.props.status === "new" || this.props.mode === "add") {
      newState = {
        activeTab: "2",
        isReadOnly: isReadOnly
      }
    } else {
      newState = {
        isReadOnly: isReadOnly
      }
    }
    if (this.props.mode === "add") newState.canSubmit = false;
    this.setState(newState);

    let support = { assignToSupervisor: null, assignToSupport: null };
    let objCurrStage = this.props.stages[this.props.stages.length - 2];

    if (objCurrStage && objCurrStage.approvers) {
      let members = objCurrStage.approvers.length > 0 ? objCurrStage.approvers[0].members : [];
      if (objCurrStage["assign_to_supervisor"]) support.assignToSupervisor = this.getMemberObj(members, objCurrStage["assign_to_supervisor"])[0];
      if (objCurrStage["assign_to_support"]) support.assignToSupport = this.getMemberObj(members, objCurrStage["assign_to_support"])[0];
    }

    this.setState({ support: support });
  }

  getMemberObj = (obj, userid) => {
    return obj.filter((e0) => {
      e0.label = e0.displayname
      return (e0.userid === userid)
    });
  }

  xxx = (action) => {
    this.setState({
      alert: true,
      confirmStr: action
    });
  };

  submitValidation() {
    let isExist;
    let obj = this.props.rowValues;
    Object.keys(obj).forEach(value => {
      if (obj[value] !== ""
        && obj[value] !== null
        && obj[value] !== undefined
        && value !== '_id'
        && value !== 'service_name'
        && value !== 'cur_status'
        && value !== 'status'
        && value !== 'date'
        && value !== 'submittedBy'
      ) {
        console.log("!!!value", value)
        isExist = true;
      }
    });

    return isExist;
  }

  onHandle(action) {
    // To show modal to user to input man hours required to complete this request.
    this.showModal("HandleRequestModal");
  }

  apply(action, _data, assignType) {
    let oldStageIndex = this.props.stages.findIndex(step => step.status === 'pending') + 1;
    let newStageIndex, approved_id, pending_id, waiting_id;
    const finalStage = this.props.stages.length + 1;
    let payload = {};
    let prIndex = this.props.stages.findIndex(step => step.status === 'pending');
    if (action === "approve") {
      if ((prIndex === this.props.stages.length - 2) && //support stage pending; other input-waiting
        this.props.stages[prIndex - 1].stage_name === "other_input" &&
        this.props.stages[prIndex - 1].status === "waiting") {
        payload = {
          other_id: this.props.stages[prIndex - 1]._id,
          approved_id: this.props.stages[prIndex]._id,
          pending_id: this.props.stages[prIndex + 1]._id,
          status: "completed"
        }
      } else if (this.props.stages[prIndex].stage_name === "other_input" &&//support stage pending; other input-pending
        this.props.stages[prIndex].status === "pending" &&
        this.props.stages[prIndex + 1].status === "pending") {
        payload = {
          other_id: this.props.stages[prIndex]._id,
          approved_id: this.props.stages[prIndex + 1]._id,
          pending_id: this.props.stages[prIndex + 2]._id,
          status: "completed"
        }
      } else if (prIndex === this.props.stages.length - 2) {
        payload = {
          approved_id: this.props.stages[prIndex]._id,
          pending_id: this.props.stages[prIndex + 1]._id,
          status: "completed"
        }
      } else {
        payload = {
          approved_id: this.props.stages[prIndex]._id,
          pending_id: this.props.stages[prIndex + 1].stage_name === "other_input" ?
            this.props.stages[prIndex + 2]._id :
            this.props.stages[prIndex + 1]._id,
        }
      }
      payload.comment = { action: action, comment: _data.action_comment };
    } else if (action === "rejected" || action === "withdrawn") {
      newStageIndex = oldStageIndex + 1;
      let actionComment = _data.action_comment;
      payload = {
        withdrawn_id: this.props.stages[newStageIndex - 2]._id,
        comment: { action: action, comment: actionComment }
      }
    } else if (action === "comment") {
      payload.comment = { action: action, comment: this.comment, send_to_requester: this.send_to_requester };
    } else if (action === "submit") {
      payload.comment = { action: action };
    } else if (action === "requestInfoSent") {
      function diffObj(upd, old) {
        let str = "";
        Object.keys(upd).forEach(item => {
          if (item !== "service_data" && item !== "seq" && upd[item] !== old[item]) {
            console.log(upd[item], old[item])
            str = str + " field " + item.toUpperCase() +
              ": old value is " + old[item] === "" ? "empty" : old[item] +
                ", new value is " + upd[item] === "" ? "empty" : upd[item] + " "
          }
        });
        return str === "" ? "nothing. " : str;
      }
      let diff = diffObj(this.state.newValue, this.props.rowValues);
      payload = {
        data: this.state.newValue,
        approved_id: this.props.stages[prIndex]._id,
        comment: { action: action, comment: "Updated: " + diff + "Message: " + _data.action_comment }
      }
    }
    else if (action === "requestInfo") {
      let other_groups = this.props.stages[prIndex - 1].approvers.map(item => item.group_name).join(" ");
      payload = {
        pending_id: this.props.stages[prIndex]._id,
        other_id: this.props.stages[prIndex - 1]._id,
        comment: { action: action, comment: "Request to " + other_groups + " team. Message: " + this.comment }
      }
    } else if (action === "complete") {
      let prIndex = this.props.stages.findIndex(step => step.status === 'pending')
      newStageIndex = oldStageIndex + 1;
      payload = {
        approved_id: this.props.stages[prIndex]._id,
        pending_id: this.props.stages[prIndex + 1]._id,
        status: "completed",
        man_hours: _data,
        comment: { action: action, comment: "" }
      }
    } else if (action === "assign") {
      const { stages } = this.props
      const cur = stages.filter(step => { return step.status === 'pending' && step.stage_name === "supTeam" });
      if (cur.length === 1) {
        const support_group = cur[0].approvers.map(a => a.group_name)

        let assignee_name = ""
        if (_data !== null) {
          assignee_name = _data.label
          payload.assignee = _data.value
        }
        payload.comment = {
          action: action,
          comment: `Assign ${assignType === ASSIGN_SUPERVISOR ? "Supervisor" : "Support"}: ${assignee_name}`,
          support_group: support_group,
        }

        this.applyAssignAndDispatch(_data, assignType === ASSIGN_SUPERVISOR ? "assign_to_supervisor" : "assign_to_support");
        this.updateStageSupport(_data, assignType === ASSIGN_SUPERVISOR ? "assignToSupervisor" : "assignToSupport");
      }
    }
    this.props.onGridEditinModal(payload, this.props.service_name, action);
    this.setState({
      stepStatus: "error",
      alert: false
    });
  }

  submit() {
    this.props.submitRequest({
      rowValues: this.state.newValue,
      serviceName: this.props.service_name
    });
    this.setState({
      isReadOnly: true
    });
  }

  toggle() {
    this.props.exitModal(null, null, this.state.action);
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleCommentBtn() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleChange(value, field) {
    let tmp = JSON.parse(JSON.stringify(this.state.newValue));
    tmp[field] = value;
    this.setState({
      newValue: tmp
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.rowValues !== nextProps.rowValues) {
      this.setState({ newValue: { ...this.props.rowValues, ...nextProps.rowValues } });
    }
  }

  saveUpdates(action) {

    let _newVls = this.state.newValue;

    if (this.childRef !== null && this.childRef.updateFirewallData) {
      this.childRef.updateFirewallData();
      return;
    }

    this.setState({ newValue: _newVls });

    if (action === "apply") {
      if (this.props.mode === "add") {
        this.props.exitModal(_newVls, this.props.service_name, "save");
      } else {
        this.props.exitModal(_newVls, this.props.service_name, "update");
      }
    } else {
      if (this.state.canSubmit === true) {
        this.props.exitModal(_newVls, this.props.service_name, "update_in_db");
      } else {
        this.props.exitModal(_newVls, this.props.service_name, "save_to_db");
        this.setState({
          canSubmit: true
        });
      }
    }
  }

  showModal(modalType) {
    this.setState({ modalType: modalType });
  }

  copyConfirmationRequest() {
    this.setState({ confirmCopy: true });
    console.log('Copy Confirmation Request');
  }

  copyRequest() {
    //this.props.exitModal(null, null, "copy");
    this.props.exitModal(this.state.newValue, this.props.service_name, "copy");
    this.setState({ confirmCopy: false });
    console.log('Copy request');
  }

  closeValidationFailed() {
    this.setState({ validationfailed: false })
  }

  updateStageSupport(value, field) {
    let _tmpSupport = JSON.parse(JSON.stringify(this.state.support));
    _tmpSupport[field] = value;
    this.setState({
      support: _tmpSupport
    })
  }

  applyAssignAndDispatch(_data, assignTo) {
    let { stages, dispatch, rowIndex, curUser } = this.props;
    const cur = stages.filter(step => step.status === 'pending');
    let _tmpData = {};
    _tmpData.stage_name = "supTeam";
    _tmpData.service_id = cur[0].service_id;
    _tmpData[assignTo] = _data ? _data.value : "";
    _tmpData.assigned_by = curUser.id;
    _tmpData.support_group = cur[0].approvers.map(a => a.group_name)
    dispatch(updateStageSupport(_tmpData, cur, rowIndex, assignTo));
  }

  // let { stages, dispatch } = this.props;
  // const cur = stages.filter(step => step.status === 'pending');
  // let _tmpData = {};
  // _tmpData.stage_name = "supTeam";
  // _tmpData.service_id = cur[0].service_id;
  // _tmpData.supervisor = _data ? _data.value : null;
  // dispatch(updateStageSupport(_tmpData));

  // applyAssign = (_data, assignType) => {
  //   this.applyAssignAndDispatch.call(this, _data, assignType === ASSIGN_SUPERVISOR ? "assign_to_supervisor" : "assign_to_support");
  //   this.updateStageSupport(_data, assignType === ASSIGN_SUPERVISOR ? "assignToSupervisor" : "assignToSupport");
  //   // this.props.onGridEditinModal(payload, this.props.service_name, action);
  // }

  // applyAssignSupervisor(_data) {
  //   this.applyAssignAndDispatch.call(this, _data, "assign_to_supervisor");
  //   this.updateStageSupport(_data, "assignToSupervisor");
  // }

  // applyAssignSupport(_data) {
  //   this.applyAssignAndDispatch.call(this, _data, "assign_to_support");
  //   this.updateStageSupport(_data, "assignToSupport");
  // }

  applyExtendedDate(_data) {
    this.handleChange(_data, "extendAgreedDate");
  }

  addComment(type, text, notifyRequester) {
    if (type === "comment" || type === "requestInfo") {
      this.comment = text
      this.send_to_requester = notifyRequester;
    } else {
      this.actionComment = text
    }
    this.apply(type);
  }

  getComment(event, type) {
    let value = event.target.value;
    this.setState({
      comment: value,
      commentType: type
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    // this.gridColumnApi.sizeColumnsToFit();
  }

  render() {
    let { isOpen, colValues, rowValues, service, stages, status, canApprove, history, curUser, mode, others, dataServices, pendingServices, isFWOpened } = this.props;
    console.log('** User Details:', curUser)

    let user = curUser.id;
    let memberOf = curUser.member_of;
    let isMemberOfOther = false;
    let isMemberOfSupport = false;
    let isMemberOfSup = false;
    memberOf.forEach((it) =>
      isMemberOfSupport = defSupportGroup.toString().indexOf(it.group_name) > -1 ? true : false,
    );
    let current, cur;
    let stepStatus = this.state.stepStatus;
    let is_other_input, is_sup;
    if (mode !== "add" && stages) {// if (mode !== "new") {
      is_other_input = stages.findIndex(step => {
        return (step.stage_name === "other_input" && step.status === "pending")
      });
      is_sup = stages.findIndex(step => {
        return (step.stage_name === "supTeam" && step.status === "pending")
      });
      memberOf.forEach((it) => {
        if (stages[is_other_input] && stages[is_other_input].approvers.findIndex(gid => { return gid.group_id === it.group_id }) > -1) {
          isMemberOfOther = true
        }
        if (stages[is_sup] && stages[is_sup].approvers.findIndex(gid => { return gid.group_id === it.group_id }) > -1) {
          isMemberOfSup = true
        }
      });
      cur = stages.findIndex(step => {
        return (step.stage_name !== "other_input" && step.status === "pending")
      });
      // if (status === "inprogress" || status === "worklist") {
      if (rowValues.cur_status === "withdrawn" || rowValues.cur_status === "rejected") {
        stepStatus = "error";
        cur = stages.findIndex(step => step.status === rowValues.cur_status);
        current = cur + 1;
      } else if (rowValues.status == "saved") {
        current = undefined;
      } else {
        stepStatus = "progress";
        current = (cur > -1) ? (cur + 1) : (((cur > -1) && (rowValues.status === "new")) ? (cur - 1) : (stages.length + 1));
      }
      // }
      // if (status === "completed") {
      //   stepStatus = "finish";
      //   current = stages.length
      // }
      if (status === "saved") {
        current = undefined;
      }
      // if (status === "withdrawn" || status === "rejected") {
      //   stepStatus = "error"
      // }
    }
    let tmp = colValues.filter(obj => {
      return (obj.field !== '_id'
        && obj.field !== 'service_name'
        && obj.field !== 'cur_status'
        && obj.field !== 'status'
        && obj.field !== 'date'
        && obj.field !== 'displayname'
        && obj.field !== 'submittedBy');
    });

    colValues = this.vitalFields.concat(tmp);

    let rowVls = this.state.newValue;
    if (status === "new" || status === undefined || mode === "add") {
      //rowVls["target_date"] = rowVls["target_date"] ? rowVls["target_date"] : moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      //rowVls["target_date"] = rowVls["target_date"] ? moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      rowVls["phone_number"] = rowVls["phone_number"] !== undefined ? rowVls["phone_number"] : curUser.phone_number;
    }
    else {
      rowVls["target_date"] = rowVls["target_date"] ? rowVls["target_date"] : rowVls["date"];
    }

    const style = { "maxWidth": "80%", "maxHeight": "80%" };

    let tis = this;

    const displayFields = () => {
      let rowVls = this.state.newValue;
      if (colValues && rowVls) {
        let fields = [];
        colValues.forEach((e, index) => {
          let inputType //select or text or other input type
          if (e.cellEditor === "agSelectCellEditor") { //if select
            let options = [] //options of select menu
            e.cellEditorParams.values.map((e) => {
              options.push({ value: e, label: e })
            })
            if (this.state.isReadOnly) {
              inputType =
                <Input value={rowVls ? rowVls[e.field] : ""}
                  type="text"
                  onChange={(event) => {
                    if (rowVls["status"] === undefined || rowVls["status"] === "saved") {
                      this.handleChange(event.target.value, e.field);
                    }
                  }}
                />
            }
            else {
              inputType = < Select
                options={options}
                isSearchable
                isClearable
                value={rowVls ? options.filter(option => option.label === rowVls[e.field]) : ""}

                onChange={
                  (event) => {
                    if (rowVls["status"] === undefined || rowVls["status"] === "saved" ||
                      (rowVls["status"] === "inprogress" && status === "worklist")) {
                      this.handleChange(event === null ? "" : event.value, e.field)
                    }
                  }
                }
              />
            }
          } else if (e.cellEditor === "dayPickerInput") {
            //show target date
            if (tis.state.isReadOnly || e.sla == undefined) {
              let _vls;
              (e.sla == undefined) ? _vls = "To Be Confirmed" :
                (_vls = moment(rowVls[e.field], ["DD-MMM-YYYY HH:mm", "YYYY-MM-DDTHH:mm:ss.SSSZ"]));
              rowVls[e.field] = _vls
              inputType =
                <Input value={_vls.format != undefined ? _vls.format("MM/DD/YYYY") : _vls}
                  type="text"
                  onChange={(event) => {
                    if (rowVls["status"] === undefined || rowVls["status"] === "saved") {
                      this.handleChange(event.target.value, e.field);
                    }
                  }}
                />
            }
            else {
              let td = rowVls[e.field];
              if (rowVls && e.sla && (status === "new" || mode === "add")) {
                rowVls[e.field] = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                let _addTilValid = 0;
                if (this._dayPicker_) {
                  //let sla = e.sla;
                  let datePicker = this._dayPicker_;
                  let _dtrow;
                  while (e.sla) {
                    _addTilValid++;
                    _dtrow = moment(rowVls[e.field], ["DD-MMM-YYYY HH:mm", "YYYY-MM-DDTHH:mm:ss.SSSZ"]).add(_addTilValid, 'd').toDate();
                    if (ModifiersUtils.getModifiersForDay(_dtrow, datePicker.props.dayPickerProps.disabledDays).length > 0) {
                    }
                    else {
                      e.sla--;
                    }
                  }
                  //console.log("disable days", ModifiersUtils.getModifiersForDay(_dtrow, datePicker.props.dayPickerProps.disabledDays));
                }
                td = moment(rowVls[e.field], ["DD-MMM-YYYY HH:mm", "YYYY-MM-DDTHH:mm:ss.SSSZ"]).add(_addTilValid, 'd').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                rowVls[e.field] = td;
              }
              inputType = <DayPickerInput
                ref={(r) => this._dayPicker_ = r}
                value={moment(td, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("MM/DD/YYYY")}
                onDayChange={(selectedDay, modifiers, dayPickerInput) => {
                  if (rowVls["status"] === undefined || rowVls["status"] === "saved"
                    || rowVls["status"] === "inprogress") {
                    const dt = moment(selectedDay).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                    this.handleChange(dt, e.field);
                    e.sla = 0
                  }
                }}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={'MM/DD/YYYY'}
                dayPickerProps={{
                  //selectedDays: rowVls ? moment(rowVls[e.field]).format("MM/DD/YYYY") : "",
                  disabledDays:
                    [
                      { daysOfWeek: [0, 6] },
                      {
                        before: new Date()
                      }
                    ].concat(e.disabledDays ? e.disabledDays.values : [])
                }}
              />
            }

          } else if (e.cellEditor === "attachment") {
            if (!rowVls[e.field] || rowVls[e.field] === "") {
              //show file upload
              inputType = <FilePond
                ref={ref => (this.pond = ref)}
                files={this.state.files}
                maxFileSize="20MB"
                // allowMultiple={true}
                // maxFiles={3}
                server={{
                  url: process.env.REACT_APP_API_TEST_PREFIX + "/upload",
                  process: {
                    onload: (response) => {
                      const result = JSON.parse(response)
                      if (result.filename) {
                        this.handleChange(result.filename, e.field);
                      }
                      return response
                    },
                  },
                  revert: {
                    headers: { "Content-Type": "application/json" }
                  }
                }}
                // oninit={() => this.handleInit()}
                onupdatefiles={fileItems => {
                  // Set currently active file objects to this.state
                  this.setState({
                    files: fileItems.map(fileItem => fileItem.file)
                  });
                }}
                onremovefile={(fileItems) => {
                  this.handleChange("", e.field);
                  this.setState({ files: [] })
                }}
                labelFileProcessingError={(response) => {
                  return (response.body)
                }}
              />
              if (this.state.isReadOnly) {//if readonly and no attachment
                inputType = <div>No attachment</div>
              }
            } else {
              //show download link
              inputType =
                <div>
                  <a target='_blank' href={`${process.env.REACT_APP_DOWNLOAD_URL_PREFIX}/${encodeURIComponent(rowVls[e.field])}`}>{rowVls[e.field]}</a>
                  {//if not readonly show cancel button
                    !this.state.isReadOnly &&
                    <Button
                      size="sm"
                      onClick={() => {
                        this.handleChange("", e.field)
                        this.setState({ files: [] })
                      }}>Cancel</Button>
                  }
                </div>
            }
          } else {
            //textbox
            inputType =
              <Input value={rowVls ? rowVls[e.field] : ""}
                type="text"

                onChange={(event) => {
                  if (rowVls["status"] === undefined || rowVls["status"] === "saved" ||
                    (rowVls["status"] === "inprogress" && status === "worklist")) {
                    this.handleChange(event.target.value, e.field);
                  }
                }}
              />
          }

          fields.push(<Col key={index} xs="6" >
            <FormGroup >
              <Label htmlFor="ccnumber" > {e.headerName} </Label>
              {inputType}
            </FormGroup>
          </Col>)
        })

        return <Row>{fields}</Row>;
      }
    };

    let stageArr = [];
    const displayStages = () => {
      if (rowValues) {
        let description = (status !== "saved") ? "Submitted by:" + rowValues.submittedBy + "\nDate:" + rowValues.date : "";
        let status = "waiting";
        return (
          <Row>
            <Col xs="12" style={{ marginTop: "20px" }}>
              <Steps labelPlacement="vertical" status={stepStatus} current={current - 1}>
                {stages.map((stage, i) => {
                  if (stage.stage_name === "other_input" && stage.status === "waiting") return;
                  description = (stage.stage_name === "other_input" && stage.status === "approved") ?
                    ("Last changes done by " + stage.approverName + "\nDate:" + stage.updated_date) :
                    (stage.stage_name === "supTeam" &&
                      stage.status === "pending" && stages[i - 1].status === "pending") ?
                      ("Request to input fields by " + stage.approverName + "\nDate:" + stage.updated_date) :
                      (stage.status === "approved" && stage.stage_id > 0) ?
                        ("Approved By:" + stage.approverName + "\nDate:" + stage.updated_date) :
                        (stage.status === "approved" && stage.stage_id === 0) ?
                          ("Submitted By:" + stage.displayname + "\nDate:" + stage.updated_date) :
                          (stage.status === "completed" && stage.stage_name === "completed") ?
                            ("Completed By:" + stage.approverName + "\nDate:" + stage.updated_date) : "";
                  let _stage =
                    (stepStatus === "error") ?
                      <Step key={stage.stage_id}
                        title={stage.name}
                        description={description}
                        ref={(r) => { if (r !== null && r._reactInternalFiber.child.stateNode.querySelector(".rc-steps-icon.rcicon") !== null) { stageArr.push(r); r._reactInternalFiber.child.stateNode.querySelector(".rc-steps-icon.rcicon").innerText = stageArr.length } }}>
                      </Step> :
                      <Step key={stage.stage_id}
                        status={stage.status === "pending" ? "progress" : (stage.status === "approved" || stage.status === "completed" ? "finish" : "wait")}
                        title={stage.name}
                        description={description}
                        ref={(r) => { if (r !== null && r._reactInternalFiber.child.stateNode.querySelector(".rc-steps-icon.rcicon") !== null) { stageArr.push(r); r._reactInternalFiber.child.stateNode.querySelector(".rc-steps-icon.rcicon").innerText = stageArr.length } }}>
                      </Step>
                  return _stage;
                })}
              </Steps>
            </Col>
          </Row>
        )
      }
    };

    const displaySupportLayout = (_newValue) => {
      function onClick_ClearSupervisor(event) {
        this.updateStageSupport(null, "assignToSupervisor");
      }
      function onClick_ClearSupport(event) {
        this.updateStageSupport(null, "assignToSupport");
      }
      return (
        <Row>
          <Col xs="4">
            <div className="card-header" style={{ backgroundColor: "#d4e2e6", padding: "0.25rem 0.75rem" }}>
              <span style={{ fontSize: "12px" }}>Support</span>
              {_newValue.assignToSupport && stages[cur].status === 'pending' ? <button type="button" className="close" onClick={() => this.apply("assign", null, ASSIGN_SUPPORT)}><span aria-hidden="true">×</span></button> : ""}
              <span style={{ display: "block", fontWeight: "bold", minHeight: "21px" }}>{_newValue.assignToSupport ? _newValue.assignToSupport.label : ""}</span>
            </div>
          </Col>

          <Col xs="4">
            <div className="card-header" style={{ backgroundColor: "#d4e2e6", padding: "0.25rem 0.75rem" }}>
              <span style={{ fontSize: "12px" }}>Supervisor</span>
              {_newValue.assignToSupervisor && stages[cur].status === 'pending' ? <button type="button" className="close" onClick={() => this.apply("assign", null, ASSIGN_SUPERVISOR)}><span aria-hidden="true">×</span></button> : ""}
              <span style={{ display: "block", fontWeight: "bold", minHeight: "21px" }}>{_newValue.assignToSupervisor ? _newValue.assignToSupervisor.label : ""}</span>
            </div>
          </Col>
        </Row >
      )
    };

    const displayApprovalBtn = () => {
      if (status && rowValues) {
        if (status === "inprogress" || status === "worklist") {
          return (
            <>
              <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Col xs="12" style={{ marginTop: "10px", textAlign: "right" }}>
                  {
                    (
                      (this.props.rowValues.status === "saved") &&
                      (this.props.rowValues.submittedBy === user)
                    ) || (
                        (mode === "add") &&
                        (!this.props.rowValues.submittedBy !== undefined)
                      ) ?
                      <>
                        {submitButton()}
                        {saveButton()}
                        {cancelButton()}
                      </> : ""
                  }
                </Col>
                {
                  (canApprove || (this.props.rowValues.status === "inprogress")) &&
                  <>
                    {(((status === "inprogress" || status === "worklist") && this.props.rowValues.status === "inprogress")) &&
                      <Col xs="auto" style={lclStyleCol}>
                        <FormGroup style={lclStyleFormGroup}>
                          {(canApprove ||
                            this.props.rowValues.submittedBy === user) &&
                            (!(isMemberOfOther &&
                              status === "worklist" &&
                              (cur == stages.length - 2))) &&
                            <Button
                              color="danger"
                              size="sm"
                              style={{ marginLeft: "7px" }}
                              onClick={() => this.xxx(this.props.rowValues.submittedBy === user ? "withdrawn" : "rejected")} >
                              {this.props.rowValues.submittedBy === user ? "WITHDRAW" : "REJECT"}
                            </Button>
                          }
                          {canApprove &&
                            <Button
                              color="success"
                              size="sm"
                              style={{ marginLeft: "7px" }}
                              onClick={() => (cur === stages.length - 2) ? (isMemberOfOther ? this.xxx("requestInfoSent") : this.onHandle("handle")) : this.xxx("approve")}>
                              {(cur === stages.length - 2) ?
                                (isMemberOfOther ? "SAVE INPUT" : "HANDLE") : "APPROVE"}
                            </Button>
                          }
                          <Button size="sm" color="primary" style={{ marginLeft: "7px" }}
                            onClick={(e) => { this.showModal("AddComment") }}>
                            Add Comment
                            </Button >
                          {stages[cur - 1].stage_name === "other_input" &&
                            stages[cur - 1].status === "waiting" &&
                            isMemberOfSup &&
                            status === "worklist" &&
                            (cur == stages.length - 2) &&
                            <Button size="sm" color="primary" style={{ marginLeft: "7px" }}
                              onClick={(e) => { this.showModal("RequestToOtherTeam") }}>
                              Request to other team
                            </Button >}
                        </FormGroup>
                        <label style={lclStyleFormGroupLabel}>Change Status</label>
                      </Col>
                    }
                    <Col xs="auto" style={lclStyleCol}>
                      {
                        <>
                          <FormGroup style={lclStyleFormGroup}>
                            <Button size="sm" color="primary"
                              onClick={(e) => { this.copyConfirmationRequest() }}>
                              Copy
                              </Button >
                          </FormGroup>
                          <label style={lclStyleFormGroupLabel}>Make New</label>
                        </>
                      }
                    </Col>

                    {isMemberOfSupport === true && !isMemberOfOther && isMemberOfSup && (cur == stages.length - 2) ?
                      <Col xs="auto" style={lclStyleCol}>
                        {
                          <>
                            <FormGroup style={lclStyleFormGroup}>
                              <Button size="sm" color="primary"
                                onClick={(e) => { this.showModal(ASSIGN_SUPPORT) }}>
                                Assign Support</Button >

                              <Button size="sm" color="primary" style={{ marginLeft: "7px" }}
                                onClick={(e) => { this.showModal(ASSIGN_SUPERVISOR) }}>
                                Assign Supervisor</Button >

                              <Button size="sm" color="primary" style={{ marginLeft: "7px" }}
                                onClick={(e) => { this.showModal("ExtendedDateModal") }}>
                                Extend Agreed Date
                              </Button >

                            </FormGroup>
                            <label style={lclStyleFormGroupLabel}>Assign Support</label>
                          </>
                        }
                      </Col> : ""}
                  </>
                }
                <br />
              </Row>
            </>
          )
        }
        else if (status === "new" || status === "saved" || mode === "add") {
          return (
            <>
              <Row style={{ marginTop: "10px", marginBottom: "10px", }}>
                <Col xs="12" style={{ marginTop: "10px", textAlign: "right" }}>
                  {saveButton()}
                  {cancelButton()}
                </Col>
                <br />
              </Row>
            </>
          )
        }
      }
    };

    const displayHistoryGrid = (_id) => {
      let colValues = [
        {
          headerName: "Action", field: "action", width: 130,
          autoHeight: true
        },
        {
          headerName: "User", field: "displayname", width: 220,
          autoHeight: true
        },
        {
          headerName: "Date", field: "date", width: 120,
          autoHeight: true
        },
        {
          headerName: "Comment", field: "comment", width: 450,
          cellStyle: { "white-space": "normal" },
          cellClass: "cell-wrap-text",
          autoHeight: true
        }
      ];
      let rowValues = [];
      if (history && history[_id]) {
        let tmp = {};
        if (Array.isArray(history[_id])) {
          history[_id].forEach((his) => {
            tmp = {};
            colValues.forEach(item => {
              tmp[item.field] = his[item.field];
            });
            rowValues.push(tmp);
          })
        }
      }
      return (
        <Row>
          <Col xs="12" className="ag-theme-balham" style={service.style}>
            {/* <h5>Service History</h5> */}
            <AgGridReact
              onGridReady={this.onGridReady}
              columnDefs={colValues}
              rowData={rowValues}>
            </AgGridReact>
          </Col>
        </Row >
      )
    }

    const submitButton = () => {
      return (
        <Button style={{ marginRight: "7px" }}
          type="reset"
          size="sm"
          // disabled={!this.state.canSubmit}
          color="success"
          onClick={() => {
            if (!this.submitValidation()) {
              this.setState({ validationfailed: true });
            } else {
              this.submit();
            }
          }}>
          <i className="fa fa-dot-circle-o"> </i> Submit
      </Button>)
    }

    const saveButton = () => {
      return (
        <Button style={{ marginRight: "7px" }}
          type="save"
          size="sm"
          color="primary"
          onClick={() => {
            this.saveUpdates((status === RequestStatus.NEW) ? "apply" : "save");
            if (status === RequestStatus.NEW) this.toggle()
          }}>
          < i className="fa fa-disk" > </i>
          {(status === RequestStatus.NEW) ? "Apply" : "Save"}
        </Button >)
    }

    const cancelButton = () => {
      return (
        <Button type="reset"
          size="sm"
          color="danger"
          onClick={() => this.toggle()} >
          < i className="fa fa-ban" > </i> Cancel
        </Button>)
    }

    return (
      <div>
        <Modal keyboard={false}
          isOpen={isOpen}
          toggle={this.toggle}
          style={style}
          className={this.props.className} >
          <ModalHeader tag="h3" toggle={this.toggle}>
            <div>
              <h5>{this.props.service && this.props.service.title ? this.props.service.title.toUpperCase() : "UNDEFINED"} SERVICE</h5>
              <h6>
                {this.props.rowValues && this.props.rowValues.service_name ? this.props.rowValues.service_name : "unsaved"}
              </h6>
            </div>
          </ModalHeader>
          <ModalBody>
            {displayApprovalBtn()}
            {/* show Firewall form if service is belong to 'firewall' 
                AND 
                isFWOpened is null, it is passed from GridCompoent.
            */}
            {(service._id == "firewall" && isFWOpened == null) ?
              <FirewallForm
                history={history}
                pendingServices={pendingServices}
                dataServices={dataServices}
                status={status}
                colValues={colValues}
                stages={stages}
                service={service}
                rowValues={rowValues}
                saveUpdates={this.saveUpdates}
                onApproveUpdate={this.onApproveUpdate}
                onRowUpdate={this.onRowUpdate}
                exitModal={this.props.exitModal}
                ref={ref => (this.childRef = ref)} />
              : (
                <>
                  <Nav tabs>
                    {stages && (status !== "new" && mode !== "add") &&
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === '1' })}
                          onClick={() => { this.toggleTab("1"); }}
                        >
                          SERVICE DETAILS
              </NavLink>
                      </NavItem>
                    }
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => { this.toggleTab("2"); }}
                      >
                        SERVICE DATA
                </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    {stages && (status !== "new") &&
                      <TabPane tabId="1">
                        {isMemberOfSupport === true && !isMemberOfOther && isMemberOfSup && rowValues.status === "inprogress" && (cur == stages.length - 2) ?
                          displaySupportLayout.call(this, this.state.support)
                          : ""}
                        <br />
                        {displayStages()}
                        <br />
                        {(history && !Array.isArray(history)) &&
                          displayHistoryGrid(rowValues._id)}
                      </TabPane>
                    }
                    <TabPane tabId="2">
                      {displayFields()}
                    </TabPane>
                  </TabContent>
                </>
              )}
          </ModalBody>
        </Modal >
        {this.state.validationfailed &&
          <SweetAlert
            warning
            title="Nothing to submit!"
            onConfirm={this.closeValidationFailed}>
            Please, enter request values!
            </SweetAlert>
        }
        {/* {this.state.alert &&
          <SweetAlert
            // warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={() => { this.apply(this.state.confirmStr) }}
            onCancel={() => { this.setState({ alert: false }) }}
          >
            You want to {this.state.confirmStr === "withdrawn" ? "withdraw" : (this.state.confirmStr === "rejected" ? "reject" : this.state.confirmStr)} service {rowValues.service_name} ?
          </SweetAlert>
        } */}

        {
          this.state.alert &&
          <ActionCommentModal
            className={this.props.className}
            isOpen={this.state.alert}
            title={(this.state.confirmStr === "withdrawn" ?
              "withdraw" : (this.state.confirmStr === "rejected" ?
                "reject" : (this.state.confirmStr === "requestInfoSent") ?
                  "save and send required fields input" : this.state.confirmStr)).toUpperCase()}
            message={"You want to " +
              (this.state.confirmStr === "withdrawn" ?
                "withdraw" : (this.state.confirmStr === "rejected" ?
                  "reject" : (this.state.confirmStr === "requestInfoSent") ?
                    "save and send required fields input for " : this.state.confirmStr))
              + " service " + rowValues.service_name + "?"}
            action={this.state.confirmStr}
            fnDismiss={() => { this.setState({ alert: false }) }}
            fnApply={this.apply}
          />
        }

        {this.state.confirmCopy &&
          <SweetAlert
            // warning
            showCancel
            confirmBtnText="Yes"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            onConfirm={() => { this.copyRequest(); }}
            onCancel={() => { this.setState({ confirmCopy: false }) }}
          >
            Do you want to copy selected request id {rowValues.service_name} duplicate?
          </SweetAlert>
        }

        {
          /*
            Modal component for Leave comment
          */
          this.state.modalType === "AddComment" ?
            <LeaveCommentModal
              className={this.props.className}
              isOpen={this.state.modalType === "AddComment"}
              fnActionDialog={this.showModal}
              fnAddComment={this.addComment}
              memberOfSupport={isMemberOfSupport}
              templates={this._templates}
              isSupportHandlingStage={stages[cur].stage_name === 'supTeam' ? true : false}
            /> : ""
        }
        {
          /*
            Modal component for Leave comment
          */
          this.state.modalType === "RequestToOtherTeam" ?
            <LeaveCommentModal
              className={this.props.className}
              isOpen={this.state.modalType === "RequestToOtherTeam"}
              fnActionDialog={this.showModal}
              fnAddComment={this.addComment}
              memberOfSupport={isMemberOfSupport}
              templates={this._templates}
              action="requestInfo"
            /> : ""
        }

        {
          (this.state.modalType === ASSIGN_SUPERVISOR || this.state.modalType === ASSIGN_SUPPORT) &&
          <AssignModal
            className={this.props.className}
            isOpen={this.state.modalType === ASSIGN_SUPERVISOR || this.state.modalType === ASSIGN_SUPPORT}
            fnActionDialog={this.showModal}
            fnApply={this.apply}
            members={stages[cur].approvers[0].members}
            assignType={this.state.modalType}>
          </AssignModal>
        }

        {
          /*
            Modal component for Add Attachment
          */
          // (this.state.modalType === "AssignSupervisor") ?
          //   <AssignSupervisorModal
          //     className={this.props.className}
          //     isOpen={this.state.modalType === "AssignSupervisor"}
          //     fnActionDialog={this.showModal}
          //     fnApply={this.applyAssignSupervisor}
          //     members={stages[cur].approvers[0].members}
          //   /> : ""
        }

        {
          /*
            Modal component for Add Attachment
          */
          // (this.state.modalType === "AssignSupport") ?
          //   <AssignSupportModal
          //     className={this.props.className}
          //     isOpen={this.state.modalType === "AssignSupport"}
          //     fnActionDialog={this.showModal}
          //     fnApply={this.applyAssignSupport}
          //     members={stages[cur].approvers[0].members}
          //   /> : ""
        }


        {
          /*
            Modal component for Handle request complete
          */
          this.state.modalType === "HandleRequestModal" ?
            <HandleRequestModal className={this.props.className}
              isOpen={this.state.modalType === "HandleRequestModal"}
              fnApply={this.apply}
              fnActionDialog={this.showModal}
            /> : ""
        }

        {
          /*
            Modal component for Add Attachment
          */
          this.state.modalType === "ExtendedDateModal" &&
          <ExtendedDateModal className={this.props.className}
            isOpen={this.state.modalType === "ExtendedDateModal"}
            fnApply={this.applyExtendedDate}
            fnActionDialog={this.showModal}
          />
        }

        {
          /*
            Blank
          */
          this.state.modalType === "" ? ""
            : ""
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  }
}
export default connect(
  mapStateToProps
)(ModalComponent)