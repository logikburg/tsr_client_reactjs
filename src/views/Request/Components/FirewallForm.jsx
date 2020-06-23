import React from 'react';
import { FormGroup, Col, Label, Input, Row, Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import GridComponent from "./GridComponent";
import classnames from 'classnames';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import Select from 'react-select'
import { connect } from 'react-redux';
import {
  updateFirewallRequestData
} from "../../../_actions";


const _dummyhost = { ip: '0.0.0.0', hostname: 'host', owner: "" };

let columnDef_IpTable = [], columnDef_PortTable = [];


class FirewallForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      radio: "eform",
      newValue: this.props.rowValues,
      hosts: this.hosts,
      data: this.dataFw,
      activeTab: '1'
    }
    this.dataFw = {};
    this.service = this.props.service;
    this.onRowUpdate = this.onRowUpdate.bind(this);
    this.updateFirewallData = this.updateFirewallData.bind(this);
  }

  //This will store the hosts.
  updateFirewallData() {
    let { dispatch } = this.props;
    dispatch(updateFirewallRequestData(this.hosts));
  };

  // To stop propagate further to send request to Main Model.
  onRowUpdate(actionType, srv, rowIndex, selectedData) {
    /*
      below is only if pass the data to reference onRowUpdate function
      this.props.onRowUpdate(actionType, srv, rowIndex, selectedData);
     */
    this.props.onRowUpdate(actionType, srv, rowIndex, selectedData);
    this.state.newValue = selectedData;
    console.log("FirewallForm onRowUpdate propagate event stopped", this.state.newValue);
  };

  componentDidMount() {
    console.log("FirewallForm : componentDidMount");
    const { service, dataServices, rowValues } = this.props;
    this.hosts = rowValues.hosts ? rowValues.hosts : [];
    //this.ports = dataServices[service.name];
    //this.setState({ hosts: this.hosts, ports: this.ports });
    this.setState({ hosts: this.hosts });
    this.updateFormData();
  }

  updateFormData() {
    const { service, dataServices } = this.props;
    let source = [], destination = [], stHosts = this.hosts ? this.hosts : [];
    let ipList = [];
    stHosts.forEach((e) => {
      ipList.push(`${e.ip} / ${e.hostname} / ${e.owner}`)
    })
    //feeding iplist to Port Table to display hosts.
    const fields = { "source": true, "destination": true };
    if (service.details[0].form !== undefined) {
      columnDef_IpTable = service.details[0].form[0];
      columnDef_PortTable = service.details[0].form[1];
      columnDef_PortTable.forEach((e) => {
        if (fields[e.field]) {
          e.cellEditorParams.values = ipList;
        }
      });
    }
    this.dataFw.hosts = this.hosts;
    //this.dataFw.ports = this.ports;
    this.setState({ hosts: this.hosts });
  }


  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  onRadioChange = (e) => {
    this.setState({ radio: e.target.value });
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

  }

  addRow = () => {
    let temp = JSON.parse(JSON.stringify(this.state.hosts));
    temp.push(_dummyhost);
    this.dataFw.hosts = this.hosts = temp;
    this.updateFormData();
  }

  copyRow = () => {
    let temp = JSON.parse(JSON.stringify(this.state.hosts))
    const rows = this.gridApi.getSelectedRows()
    const nodes = this.gridApi.getSelectedNodes()
    const insertIndex = nodes.length > 0 ? nodes[nodes.length - 1].rowIndex + 1 : 0
    temp.splice(insertIndex, 0, ...rows)
    //this.setState({ hosts: temp })
    this.dataFw.hosts = this.hosts = temp;
    this.updateFormData();
  }

  deleteRow = () => {
    let temp = JSON.parse(JSON.stringify(this.state.hosts))
    let rows = this.gridApi.getSelectedNodes()
    for (let i = rows.length - 1; i >= 0; i--) {
      temp.splice(rows[i].rowIndex, 1)
    }
    //this.setState({ hosts: temp })
    this.dataFw.hosts = this.hosts = temp;
    this.updateFormData();
  }

  updateRows = (e) => {
    let temp = JSON.parse(JSON.stringify(this.state.hosts))
    // let tempOption = JSON.parse(JSON.stringify(this.state[e.data.type]))
    temp[e.rowIndex] = e.data
    // let option = `${e.data.ip}    ${e.data.hostname}    ${e.data.owner}`
    // tempOption.push(option)
    this.dataFw.hosts = this.hosts = temp;
    this.updateFormData();
  }

  handleDataChange(value, field) {
    // let value = event.target.value;
    let tmp = JSON.parse(JSON.stringify({}));
    tmp[field] = value;
    this.setState({
      endorsement: tmp
    })
  }

  displayDynaFields = service => {
    //let rowVls = this.state.newValue;
    const style = { "maxWidth": "80%", "maxHeight": "80%" };
    let fields = [];
    let colValues = service.details[0].form[2];
    colValues.forEach((e, index) => {
      let inputType //select or text or other input type
      if (e.cellEditor === "agSelectCellEditor") { //if select
        let options = [] //options of select menu
        e.cellEditorParams.values.map((e) => {
          options.push({ value: e, label: e })
        })
        inputType = < Select
          options={options}
          isSearchable
          isClearable
          //value={options.filter(option => option.label === rowVls[e.field])}
          isDisabled={this.state.isReadOnly}
          onChange={
            (event) => {
              this.handleDataChange(event === null ? "" : event.value, e.field)
            }
          }
        />
      }
      else if (e.cellEditor === "textarea") { //if select
        //textbox
        inputType =
          <Input
            type={e.cellEditor == null ? "textarea" : e.cellEditor}
            rows={e.rows}
            disabled={this.state.isReadOnly}
            onChange={(event) => {
              this.handleDataChange(event.target.value, e.field);
            }
            }
          />
      } else {
        //textbox
        inputType =
          <Input //value={rowVls[e.field]}
            type="text"
            disabled={this.state.isReadOnly}
            onChange={(event) => {
              this.handleDataChange(event.target.value, e.field);
            }
            }
          />
      }

      fields.push(
        <FormGroup key={index}>
          <Row>
            <Col md="3">
              <Label htmlFor="row_{index}">{e.headerName}</Label>
            </Col>
            <Col md="8">
              {inputType}
            </Col>
          </Row>
        </FormGroup>
      )
    })

    return <>{fields}</>;
  };

  render() {
    // let source = [], destination = [], option = JSON.parse(JSON.stringify(this.state.input))
    // option.forEach((e) => {
    //   ipList.push(`${e.ip} / ${e.hostname} / ${e.owner}`)
    // });
    // switch (e.type) {
    //   case "Source":
    //     source.push(`${e.ip} / ${e.hostname} / ${e.owner}`)
    //     break
    //   case "Destination":
    //     destination.push(`${e.ip} / ${e.hostname} / ${e.owner}`)
    // }
    const { radio } = this.state
    const { history, pendingServices, service, dataServices, colValues, stages, status, onApproveUpdate, onRowUpdate, saveUpdates } = this.props

    console.log("FirewallForm : onRowUpdate is defined", onRowUpdate !== undefined);
    console.log("FirewallForm : service ", service);

    const button =
      <div style={{ float: "right", marginTop: "10px" }}>
        < Button
          style={{ marginRight: "5px" }}
          size="sm"
          color="success"
          onClick={() => this.addRow(service.name)}>
          <i className="fa fa-plus-circle" > Add</i>
        </Button>
        < Button
          style={{ marginRight: "5px" }}
          size="sm"
          color="warning"
          onClick={() => this.copyRow(service.name)}>
          <i className="fa fa-copy" > Copy</i>
        </Button>
        <Button
          size="sm"
          color="danger"
          onClick={() => this.deleteRow(service.name)}>
          <i className="fa fa-trash"> Delete</i>
        </Button>
      </div>
    return (
      <div>
        <FormGroup row>
          <Col md="12">
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="eform" onClick={this.onRadioChange} defaultChecked="true" />
              <Label className="form-check-label" check htmlFor="inline-radio1">E-Form</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="hardcopy" onClick={this.onRadioChange} />
              <Label className="form-check-label" check htmlFor="inline-radio2">Hardcopy</Label>
            </FormGroup>
          </Col>
        </FormGroup>
        {radio === "eform" &&
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}
                >
                  Access Info
            </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2'); }}
                >
                  Endorsement & Other Info
            </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Row>
                  <Col>
                    <Label>IP List</Label>
                    <div className="ag-theme-balham"
                      style={{ height: "200px" }}>
                      <AgGridReact
                        onGridReady={this.onGridReady}
                        suppressMovableColumns
                        enableColResize
                        rowSelection="multiple"
                        defaultColDef={{ editable: true }}
                        stopEditingWhenGridLosesFocus
                        editType="fullRow"
                        onRowEditingStopped={(e) => { this.updateRows(e) }}
                        columnDefs={columnDef_IpTable}
                        rowData={this.state.hosts}
                      />
                    </div>
                    {button}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label>Port Details</Label>
                    {/* <div className="ag-theme-balham"
                      style={{ height: "200px" }}>
                      <AgGridReact
                        onGridReady={this.onGridReady}
                        suppressMovableColumns
                        enableColResize
                        rowSelection="multiple"
                        defaultColDef={{ editable: true }}
                        stopEditingWhenGridLosesFocus
                        editType="fullRow"
                        //onRowEditingStopped={(e) => { this.updateRows(e) }}
                        columnDefs={columnDef_PortTable}
                        rowData={dataServices[service.name]}
                      />
                    </div> */}
                    <GridComponent
                      isFWOpened="true"
                      onRowUpdate={this.onRowUpdate}
                      rowHeight="28"
                      history={history}
                      pendingServices={pendingServices}
                      service={service}
                      dataServices={dataServices}
                      status={status}
                      colValues={columnDef_PortTable}
                      stages={stages}
                      onApproveUpdate={onApproveUpdate}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                {this.displayDynaFields(service)}
              </TabPane>
            </TabContent>
          </div>
        }
        {radio === "hardcopy" &&
          <Input type="file" id="file-input" name="file-input" />
        }
      </div>
    );
  }
}
export default connect(null, null, null, { forwardRef: true }
)(FirewallForm)