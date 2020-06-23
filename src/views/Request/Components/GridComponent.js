import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import NumericEditor from "./numericEditor";
import OSEditor from "./osEditor";
import OSRenderer from "./osRenderer";
import ModalComponent from "./ModalComponent";
import { Row, Col, Button } from 'reactstrap';
//import _ from 'lodash';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import moment from 'moment'
const dateFormat = 'DD-MMM-YYYY HH:mm';

class GridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameworkComponents: {
        numericEditor: NumericEditor,
        osRenderer: OSRenderer,
        osEditor: OSEditor
      },
      isModalOpen: false,
      selectedRows: [],
      something: true,
      updated: false,
      rowIndex: 0

    };

    this.onGridReady = this.onGridReady.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.onGridEditinModal = this.onGridEditinModal.bind(this);
    this.exitModal = this.exitModal.bind(this);
    this.openAddModal = this.openAddModal.bind(this);
    this.addRow = this.addRow.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.onRemoveSelected = this.onRemoveSelected.bind(this);
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onGridStyle = this.onGridStyle.bind(this);
    this.xxx = this.xxx.bind(this);
  }
  componentDidMount() {
    this.setState({
      user: JSON.parse(localStorage.getItem("user"))
    });
  }

  xxx = (action, service, name) => {
    this.setState({
      alert: true,
      confirmStr: `Are you sure to you want to ` + action + ` service: ` + (name ? name : service) + ` ?`
    });
  };

  onGridStyle(params) {
    //console.log("params", params)
    let pendingServices = this.props.pendingServices;
    //console.log("this.props.status======>", this.props.status)
    if (pendingServices && (this.props.status === "worklist")) {
      if (pendingServices.indexOf(params.data._id) !== -1) return { background: '#d4edda' };
      if (params.data.status === "saved") return { background: '#63c2de' };
      if (pendingServices.indexOf(params.data._id) === -1) return { background: '#f0f3f5' };
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.setColumnVisible('_id', false);
    this.gridColumnApi.setColumnVisible('status', false);
    // console.log("this.gridApi", this.gridApi)
    // this.onGridStyle(params);
    // params.api.sizeColumnsToFit();
    // this.gridColumnApi.sizeColumnsToFit();
  }

  addRow(srv, newValue, type) {
    this.props.onRowUpdate(type, srv, this.state.rowIndex, newValue);
  }

  onRemoveSelected(srv) {
    let selectedData = this.state.selectedRows;
    this.gridApi.updateRowData({ remove: selectedData });
    let rowData = [];
    this.gridApi.forEachNode(function (node) {
      rowData.push(node.data);
    });
    let actionType = "remove";
    this.gridApi.redrawRows();
    this.props.onRowUpdate(actionType, srv, this.state.rowIndex, selectedData[0]);
    this.setState({
      selectedRows: [],
      alert: false
    });
  }

  onSelectionChanged(params) {
    this.gridApi = params.api;
    let { selectedRows, rowIndex } = this.state;
    let node = this.gridApi.getSelectedNodes()[0];
    let row = this.gridApi.getSelectedRows()[0];
    if (row) {
      selectedRows = [row];
      rowIndex = node.rowIndex;
      this.setState({
        selectedRows: selectedRows,
        rowIndex: rowIndex
      });
    }
  }

  openEditModal(e) {
    this.setState({
      rowIndex: e.rowIndex,
      isModalOpen: true
    });
  }

  submitRequest(values) {
    let user = JSON.parse(localStorage.getItem("user")).id;
    let rowIndex = (this.state.isAddModalOpen === true) ? this.gridApi.getLastDisplayedRow() : this.state.rowIndex;
    if (values.rowValues._id) {
      this.props.onSubmitRequest({ ...values, user: user, rowIndex: rowIndex });
    } else {
      this.addRow(values.serviceName, values.rowValues, "saveSubmit");
      this.setState({
        curService: values.serviceName,
        rowIndex: rowIndex + 1
      });
    }
  }

  openAddModal() {
    this.setState({ isAddModalOpen: true, rowIndex: this.gridApi.getLastDisplayedRow() })
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.curService && this.props.dataServices !== nextProps.dataServices && nextProps.dataServices[this.state.curService]) {
      this.setState({
        updated: true
      });
    }
  }

  exitModal(newValue, service_name, action) {
    let rowIndex = this.state.isAddModalOpen ? this.gridApi.getLastDisplayedRow() : this.state.rowIndex;
    if (this.state.isAddModalOpen && newValue && action === "save_to_db" && this.props.status !== "new") {
      this.addRow(service_name, newValue, action);
      this.setState({
        curService: service_name,
        rowIndex: rowIndex + 1
      });
    } else if (action === "save") {
      this.addRow(service_name, newValue, action);
      this.setState({
        rowIndex: rowIndex + 1
      });
    } else if (action == "copy") {
      this.props.onRowUpdate("copy", service_name, this.state.rowIndex, newValue);
      // let { dataServices, service, stages } = this.props;
      // let _data = [];
      // this.gridApi.forEachNode(function (node, i) {
      //   _data.push(node.data);
      // });
      // if (dataServices[service._id].data[this.state.rowIndex] !== null) {
      //   _data.push(dataServices[service._id].data[this.state.rowIndex])
      //   stages.push(stages[this.state.rowIndex]);
      // }
      // let _newData = { "dataServices": dataServices, "stages": stages };
      // this.gridApi.setRowData(_data);
      //this.props.onRowUpdate("copy", service._id, this.state.rowIndex, _newData);
      //console.log("copy > this.gridApi.push() > ", this.gridApi.getSelectedRows().length);
      this.setState({
        copied: true,
        isModalOpen: false,
        isAddModalOpen: false
      });
    } else if (newValue && action == "update_in_db") {
      let ind = this.state.rowIndex;
      let rowData = [];
      this.gridApi.forEachNode(function (node, i) {
        if (ind === i) {
          rowData.push(newValue);
        } else {
          rowData.push(node.data);
        }
      });
      this.gridApi.setRowData(rowData);
      this.props.onRowUpdate("update_in_db", service_name, rowIndex, newValue);
      this.setState({
        curService: service_name,
        //rowIndex: rowIndex + 1
      });
    }
    else if (newValue && action == "update") {
      let ind = this.state.rowIndex;
      let rowData = [];
      this.gridApi.forEachNode(function (node, i) {
        if (ind === i) {
          rowData.push(newValue);
        } else {
          rowData.push(node.data);
        }
      });
      this.gridApi.setRowData(rowData);
      this.props.onRowUpdate("update", service_name, rowIndex, newValue);

    } else {
      this.setState({
        updated: false,
        isModalOpen: false,
        isAddModalOpen: false
      });
    }
    this.gridApi.redrawRows();
    // this.setState({
    //   isModalOpen: false
    // });

    // add phone number to local storage as part of User object.
    if (newValue && newValue.phone_number !== undefined) {
      let _usr = JSON.parse(localStorage.getItem("user"));
      if (!_usr.phone_number || _usr.phone_number !== newValue.phone_number) {
        _usr.phone_number = newValue.phone_number;
        // store user details after updating phone_number
        localStorage.setItem('user', JSON.stringify(_usr));
        this.setState({
          user: JSON.parse(localStorage.getItem("user"))
        });
      }
    }
  }

  onGridEditinModal(payload, service_name, action) {
    if (payload) {
      let user = JSON.parse(localStorage.getItem("user")).id;
      let displayname = JSON.parse(localStorage.getItem("user")).displayname;
      let date = moment(new Date()).format(dateFormat);
      let rowIndex = this.state.isAddModalOpen ? this.gridApi.getLastDisplayedRow() : this.state.rowIndex;
      let service_id = this.state.isAddModalOpen ? this.props.dataServices[service_name].data[rowIndex]._id :
        this.state.selectedRows[0]._id;
      payload = { ...payload, approvalDate: date, service_id: service_id, approvedBy: user, displayname: displayname }
      let serviceInfo = { rowIndex: this.state.rowIndex, service_name: service_name, service_id: service_id };
      if (action == 'comment') {

      }
      else if (action == 'complete') {
        let requestId = this.state.selectedRows[0].service_name;
        this.setState({ completed: true, RequestId: requestId, isModalOpen: false })
      }
      else if (action === "requestInfoSent") {
        this.props.onRowUpdate("update_in_db", service_name, rowIndex, payload.data);
      }
      this.props.onApproveUpdate(serviceInfo, payload);
    }
  }

  render() {
    let { service, dataDefault, dataServices, status, colValues, pendingServices, history, rowHeight, others, isFWOpened, onRowUpdate } = this.props;

    let selection = this.state.selectedRows;

    console.log("GridComponent: isFWOpened", isFWOpened);
    console.log("GridComponent : onRowUpdate is defined", onRowUpdate !== undefined);

    if (service && dataServices && colValues && status && pendingServices && history) {
      let rowValues, stages = [];
      rowValues = dataServices[service._id] ? dataServices[service._id].data : [];
      stages = dataServices[service._id] ? dataServices[service._id].stage : [];
      if (rowValues) {
        rowValues.forEach((val, i) => {
          // if (status === "withdrawn") {
          //   return val.cur_status = status;
          // } else 
          if (val.status === "complete") {
            return val.cur_status = "Completed";
          } else if (val.status === "inprogress") {
            let tmp = stages[i].findIndex(step => { return step.status === 'pending' });
            if (tmp > -1) {
              return val.cur_status = stages[i][tmp].status + " " + stages[i][tmp].name;
            } else {
              val.status = "complete";
              return val.cur_status = "Completed";
            }
          } else if (val.status === "saved") {
            return val.cur_status = "New request";
          } else {
            return val.cur_status = val.status;
          }
        })
      }
      return (
        <Row key={service._id + "_grid"} >
          <Col xs="12" >
            <div className="ag-theme-balham"
              style={service.style}>
              <AgGridReact
                rowHeight={rowHeight ? rowHeight : ""}
                onGridReady={this.onGridReady}
                columnDefs={colValues}
                rowData={rowValues ? rowValues : []}
                rowSelection='single'
                onSelectionChanged={this.onSelectionChanged}
                getRowStyle={this.onGridStyle}
                onRowDoubleClicked={e => { this.openEditModal(e) }}
                floatingFilter={true}
              >
              </AgGridReact>
            </div>
            {
              this.state.isModalOpen === true &&
              (<ModalComponent isOpen={this.state.isModalOpen}
                isFWOpened={isFWOpened}
                onRowUpdate={onRowUpdate}
                pendingServices={pendingServices}
                curUser={this.state.user}
                service_name={service._id}
                status={status}
                rowIndex={this.state.rowIndex}
                rowValues={dataServices[service._id].data[this.state.rowIndex] ?
                  dataServices[service._id].data[this.state.rowIndex] : {}
                }
                others={others}
                dataServices={dataServices}
                stageService={stages}
                history={history}
                colValues={colValues}
                service={service}
                stages={dataServices[service._id].stage[this.state.rowIndex]}
                exitModal={this.exitModal}
                submitRequest={this.submitRequest}
                onGridEditinModal={this.onGridEditinModal}
                //history={status === "new" ? undefined : (dataServices[service._id].stage[this.state.rowIndex] !== undefined ? history[dataServices[service._id].data[this.state.rowIndex]._id] : undefined)}
                canApprove={pendingServices.length > 0 && dataServices[service._id].data[this.state.rowIndex] !== undefined ?
                  (pendingServices.indexOf(dataServices[service._id].data[this.state.rowIndex]._id) !== -1) : false
                }
              />)
            }

            {
              this.state.isAddModalOpen === true &&
              (<ModalComponent isOpen={this.state.isAddModalOpen}
                isFWOpened={isFWOpened}
                onRowUpdate={onRowUpdate}
                pendingServices={pendingServices}
                curUser={this.state.user}
                service_name={service._id}
                status={status}
                mode={this.state.updated ? "" : "add"}
                //rowValues={(this.props.status == "new") ? dataDefault[service._id].data[0] :
                rowValues={(this.props.status == "new") ? new Object() :
                  this.state.updated ?
                    this.props.dataServices[service._id].data[this.state.rowIndex] :
                    new Object()}
                others={others}
                dataServices={dataServices}
                history={history}
                colValues={colValues}
                service={service}
                stages={this.state.updated ? (dataServices ? dataServices[service._id].stage[this.state.rowIndex] : []) : (dataDefault ? dataDefault[service._id].stage : [])}
                exitModal={this.exitModal}
                addRow={this.addRow}
                submitRequest={this.submitRequest}
                onGridEditinModal={this.onGridEditinModal}
              />)
            }
            {
              (status !== "withdrawn" && status !== "handled" && status !== "completed") &&
              <div style={{ float: "right", marginTop: "10px" }}>
                < Button
                  style={{ marginRight: "5px" }}
                  size="sm"
                  color="success"
                  onClick={() =>
                    this.openAddModal()
                  }>
                  <i className="fa fa-plus-circle" >Add </i>
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  disabled={!(selection && selection.length > 0
                    && ((selection[0].submittedBy === this.state.user.id
                      && selection[0].status === "saved")
                      || (status === "new"))
                  )}
                  onClick={() => { this.xxx("delete", service._id, selection[0].service_name) }}>
                  <i className="fa fa-trash">Delete</i>
                </Button>
              </div>
            }
            {this.state.alert &&
              <SweetAlert
                // warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="default"
                //title="Are you sure?"
                onConfirm={() => { this.onRemoveSelected(service._id) }}
                onCancel={() => { this.setState({ alert: false }) }}
              >
                {this.state.confirmStr}
              </SweetAlert>
            }

            {this.state.copied &&
              <SweetAlert
                title="Copied"
                confirmBtnText="Ok"
                onConfirm={() => { this.setState({ copied: false }) }}
              >
                Copied request is added successfully.
              </SweetAlert>
            }

            {this.state.completed &&
              <SweetAlert
                title="Complete"
                confirmBtnText="Ok"
                onConfirm={() => { this.setState({ completed: false }) }}
              >
                Your service {this.state.RequestId} is completed successfully.
              </SweetAlert>
            }
          </Col>
        </Row >
      );
    } else {
      return (<div>Loading...</div>)
    }
  }
}
export default connect(
  //mapStateToProps
)(GridComponent);
