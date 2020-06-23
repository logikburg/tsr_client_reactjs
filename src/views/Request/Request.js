import React, { Component } from "react";
import ScrollUpButton from "react-scroll-up-button";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Card, CardHeader, CardBody, Collapse, Input } from "reactstrap";
import { AppSwitch } from '@coreui/react';
import GridComponent from "./Components/GridComponent";
import FirewallForm from "./Components/FirewallForm"
import _ from "lodash";
import SweetAlert from 'react-bootstrap-sweetalert';
import { RequestStatus } from "../../_constants"

import {
  updateRequestData,
  saveRequestData,
  submitRequestData,
  approveStage,
  setBundleListDataLoading,
  setPackageUILoading,
  updateStatusBundle,
  setBundleDataLoading,
  submitBundle,
  setInitData,
  delBundle
} from "../../_actions";

const btnStyle = { marginRight: "5px", float: "right" };

const defaultField = ["target_date", "project_code", "environment", "purpose", "phone_number"];

class NewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      collapse: {},
      btnStyle: { position: "fixed", zIndex: 3 },
      status: this.props.match.url.split("/")[2],
      packageType: this.props.match.params["name"],
      id: this.props.match.params["id"]
    };
    this.submitValidation = this.submitValidation.bind(this);
    this.switchPanel = this.switchPanel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onApproveUpdate = this.onApproveUpdate.bind(this);
    this.onRowUpdate = this.onRowUpdate.bind(this);
    this.onSubmitRequest = this.onSubmitRequest.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.closeValidationFailed = this.closeValidationFailed.bind(this);
    this.user = JSON.parse(localStorage.getItem("user"));
    this.memberOf = this.user.member_of;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    const packageType = this.state.packageType;
    const status = this.state.status;
    dispatch(setInitData(packageType));
    if (id) {
      dispatch(setBundleDataLoading(id));
    }
    let userId = this.user.id;
    if (status === RequestStatus.WORKLIST) {
      dispatch(setBundleListDataLoading(status, { user: userId }));
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  xxx = (action) => {
    this.setState({
      alert: true,
      confirmStr: action
    });
  };

  submitValidation() {
    let test = this.props.ds[this.state.packageType];
    let isServicesExist = false;
    Object.keys(JSON.parse(JSON.stringify(this.props.ds[this.state.packageType]))).forEach((key, val) => {
      let tmpVal = this.props.ds[this.state.packageType][key]["data"];
      let tmpNew = [];
      test[key]["data"] = [];
      for (let k = 0; k < tmpVal.length; k++) {
        let isExist = false;
        Object.keys(tmpVal[k]).forEach(value => {
          if (defaultField.toString().indexOf(value) > -1) {

          }
          else if (tmpVal[k][value] !== "" && tmpVal[k][value] !== null && tmpVal[k][value] !== undefined) {
            isExist = true;
            isServicesExist = true;
            tmpNew.push(tmpVal[k]);
          }
        });

        if (isExist) {
          test[key]["data"].push(tmpVal[k]);
        }
      }
    });
    console.log("test", test, "isServicesExist", isServicesExist)
    let result = isServicesExist ? test : {};
    return result;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  handleScroll(event) {
    //console.log("pageYOffset ", window.pageYOffset, "window.scrollY", window.scrollY)
    if (window.pageYOffset > 20) {
      this.setState({ btnStyle: { position: "fixed", zIndex: 3, top: "65px" } });
    } else {
      this.setState({ btnStyle: { position: "fixed", zIndex: 3 } });
    }
  };

  handleSubmit(status, data) {
    const { id } = this.props.match.params;
    const { url } = this.props.match;
    let oldStatus = url.split("/")[2];
    let { dispatch, stages, dataServices } = this.props;
    let user = JSON.parse(localStorage.getItem("user")).id;
    let displayname = JSON.parse(localStorage.getItem("user")).displayname;

    let payload = {
      bundle_type: this.state.packageType,
      status: status,
      user: user,
      displayname: displayname,
      data:
      {
        services: data,
        //stages: stages
      }
    }
    if (oldStatus === RequestStatus.NEW) {
      dispatch(submitBundle(payload));
    }
    if (oldStatus === RequestStatus.SAVED ||
      status === RequestStatus.WITHDRAWN ||
      status === "towithdrawn" ||
      status === "tocompleted"
    ) {
      dispatch(updateStatusBundle({ id: id, newStatus: status, user: user }));
    }
    if (status === RequestStatus.DELETE) {
      dispatch(delBundle({ _id: id }));
    }
  }

  onSubmitRequest(payload) {
    const { dispatch } = this.props;
    dispatch(submitRequestData({ ...payload, bundle_type: this.state.packageType }));
  }

  switchPanel(i) {
    const col = this.state.collapse;
    col[i] = !col[i];
    this.setState({
      collapse: col
    });
  }

  scrollToService(srv_id) {
    // const element = document.getElementById(srv_id);
    // console.log("element", element);
    // element.scrollIntoView({ behavior: "smooth", block: "start" });
    const element = document.getElementById(srv_id);
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    //console.log("offsetPosition", offsetPosition)
    window.scrollTo(0, offsetPosition
      //   {
      //   top: 1200,
      //   behavior: 'smooth'
      // }
    );
  }

  onApproveUpdate(serviceInfo, payload) {
    const { dispatch } = this.props;
    console.log("serviceInfo", serviceInfo)
    serviceInfo.bundle_type = this.state.packageType;
    dispatch(approveStage(serviceInfo, payload));
  }

  onRowUpdate(actionType, srv, index, data) {
    const { dispatch, dataDefault } = this.props;
    let bundleId = this.props.match.params.id;
    let user = JSON.parse(localStorage.getItem("user")).id;
    let displayname = JSON.parse(localStorage.getItem("user")).displayname;
    let new_data = data ? data : {};
    let newData = {
      packageType: this.state.packageType,
      service: srv,
      data: new_data,
      user: user,
      displayname: displayname,
    };
    let payload = null;
    if (actionType === "save_to_db" || actionType === "copy") {
      payload = {
        stages: JSON.parse(JSON.stringify(dataDefault[this.state.packageType][srv]["stage"])),
        data:
        {
          bundle_name: bundleId,
          service_data: data,
          service_type: srv,
          submittedBy: user,
          displayname: displayname,
        }
      };
      dispatch(saveRequestData(payload));
    } else if (actionType === "saveSubmit") {
      payload = {
        stages: JSON.parse(JSON.stringify(dataDefault[this.state.packageType][srv]["stage"])),
        data:
        {
          bundle_name: bundleId,
          service_data: data,
          service_type: srv,
          submittedBy: user,
          displayname: displayname,
        },
        submit: {
          rowValues: {},
          serviceName: srv,
          user: user,
          rowIndex: index + 1,
          bundle_type: this.state.packageType
        }
      };
      dispatch(saveRequestData(payload));
      // } else if (actionType === "copy") {
      //   console.log("copy old", JSON.parse(JSON.stringify(data["stages"][index])));
      //   console.log()
      //   payload = {
      //     stages: JSON.parse(JSON.stringify(dataDefault[this.state.packageType][srv]["stage"])),
      //     //stages: JSON.parse(JSON.stringify(data["stages"][index])),
      //     data:
      //     {
      //       bundle_name: bundleId,
      //       service_data: JSON.parse(JSON.stringify(data["dataServices"][srv].data[index])),
      //       service_type: srv,
      //       submittedBy: user,
      //       displayname: displayname,
      //     }
      //   };
      //   dispatch(saveRequestData(payload));
    } else {
      dispatch(updateRequestData(actionType, newData, index));
    }

    // TODO if require to add phone number to local storage as part of User object.
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    const packageType = this.state.packageType;

    if (this.props.dataServices !== nextProps.dataServices) {
      this.setState({ btn: true });
    }
    if (nextProps.loadedUI == true && nextProps.updated == false) {
      dispatch(setInitData(packageType));
    }
  }

  closeValidationFailed() {
    this.setState({ validationfailed: false })
  }

  render() {
    let { configBundleUI, configRequestUI, ui, ds, dataDefault, pendingServices, history, others } = this.props;
    let packageType = this.state.packageType;
    let status = this.state.status;
    let isSwitch = this.state.collapse;
    let psIds = {};
    let psLen = {};
    let cmpleteLen = {};
    let totalLen = {};
    let isDataLoaded = false;
    let isRender = (status === RequestStatus.WORKLIST) ? pendingServices.length > 0 : true;

    function cleanColValues(colValues) {
      let cleanColValues = []
      if (status !== RequestStatus.NEW && status !== RequestStatus.SAVED) {
        cleanColValues = [{
          "headerName": "_id",
          "field": "_id",
        },
        {
          "headerName": "Service Name",
          "field": "service_name",
        },
        {
          "headerName": "Request Status",
          "field": "status"
        },
        {
          "headerName": "Current Status",
          "field": "cur_status",
          "pinned": 'right',
          "width": 250
        },
        {
          "headerName": "Submitted By",
          "field": "displayname",
        },
        {
          "headerName": "Submition Date",
          "field": "date",
        }]
      };
      colValues.forEach(item => {
        cleanColValues.push(_.omit(item, ["isMandatory", "isShared", "defaultValue"]));
      })
      return cleanColValues;
    }

    //For new requests, data.length always 0
    if (status == "new") {
      isDataLoaded = true;
    }
    else if (packageType && ui && ds && ui[packageType]) {
      let dataServices = ds[packageType];
      let uiServices = ui[packageType];
      if (dataServices) {
        uiServices.forEach((u) => {
          if (dataServices[u._id] && dataServices[u._id].data && dataServices[u._id].data.length > 0) {
            isDataLoaded = true;
          }
        })
      }
    }

    if (configBundleUI && configRequestUI && ui && ds && packageType
      && status && history && ui[packageType] && isDataLoaded) {
      let uiServices = ui[packageType];
      let dataServices = ds[packageType];
      let that = this;
      const ui_name = this.props.match.params.name
      for (let config of configBundleUI) {

        // show tabs belong to visibleTo
        config.services.forEach((t) => {
          //pending service calculation
          psLen[t.name] = 0;
          that.memberOf.forEach((m) => {
            if (dataServices[t.name])
              for (var _si = 0; _si < dataServices[t.name].stage.length; _si++) {
                let stage = dataServices[t.name].stage[_si];
                stage.forEach(_stage => {
                  if (_stage.status === RequestStatus.PENDING
                    && _stage.approvers && _stage.approvers.length > 0) {
                    _stage.approvers.forEach((_e) => {
                      if (_e.group_name === m.group_name) {
                        psLen[t.name]++;
                      }
                    });
                  }
                })
              }
          });
        });

        if (config._id === ui_name) { //check the ui name is bundle of not
          // show tabs belong to visibleTo
          config.services.forEach((t) => {

            //pending service calculation
            // psLen[t.name] = 0;
            // that.memberOf.forEach((m) => {
            //   if (dataServices[t.name])
            //     for (var _si = 0; _si < dataServices[t.name].stage.length; _si++) {
            //       let stage = dataServices[t.name].stage[_si];
            //       stage.forEach(_stage => {
            //         if (_stage.status === RequestStatus.PENDING
            //           && _stage.approvers && _stage.approvers.length > 0) {
            //           _stage.approvers.forEach((_e) => {
            //             if (_e.group_name === m.group_name) {
            //               psLen[t.name]++;
            //             }
            //           });
            //         }
            //       })
            //     }
            // });

            if (t.visibleTo !== undefined && that.memberOf !== undefined) {
              that.memberOf.forEach((m) => {
                if (dataServices[t.name] && dataServices[t.name].data.length > 0) {
                  uiServices.forEach((u, i) => {
                    if (u._id == t.name) {
                      u.enable = true;
                    }
                  })
                }
                else if (t.visibleTo.toString().indexOf(m.group_name) < 0) {
                  let _iex = -1;
                  uiServices.forEach((u, i) => {
                    if (u._id == t.name) {
                      _iex = i;
                      u.enable = false;
                    }
                  })
                }
              })
              console.log('that.memberOf', that.memberOf);
            }
          }
          )
        }
      }

      console.log("dataServices in Request", dataServices)
      let serviceStatus = { complete: 0, saved: 0, inprogress: 0, rejected: 0, withdrawn: 0 }
      uiServices.forEach(ui => {
        if (dataServices[ui._id] && dataServices[ui._id] !== undefined) {
          cmpleteLen[ui._id] = 0;
          totalLen[ui._id] = dataServices[ui._id].data.length;
          serviceStatus["all"] = serviceStatus["all"] + totalLen[ui._id];
          //psLen[ui._id] = 0;
          if (status === RequestStatus.WORKLIST && false) {
            //isDisable[ui._id] = false;
            if (isSwitch[ui._id] !== undefined) {
              isSwitch[ui._id] = isSwitch[ui._id];
              //if (isSwitch[ui._id]) {
              dataServices[ui._id].data.forEach(service => {
                if (service.status == RequestStatus.INPROGRESS)
                  //psLen[ui._id]++;

                  for (let i = 0; i < pendingServices.length; i++) {
                    if (service._id === pendingServices[i]) {
                      //isDisable[ui._id] = true;
                      psIds[ui._id] = true;
                    }
                  }
              })
              //};
            } else {
              if (dataServices[ui._id].data.length > 0) isSwitch[ui._id] = true;

              dataServices[ui._id].data.forEach(service => {
                if (service.status == RequestStatus.INPROGRESS)
                  //psLen[ui._id]++;

                  for (let i = 0; i < pendingServices.length; i++) {
                    isSwitch[ui.name] = true;
                    if (service._id === pendingServices[i]) {
                      psIds[ui._id] = true;
                    }
                  }
              });
            };
          } else if (status === RequestStatus.INPROGRESS) {
            let flag = false;
            if (isSwitch[ui._id] !== undefined) {
              isSwitch[ui._id] = isSwitch[ui._id];
              dataServices[ui._id].data.forEach(service => {
                serviceStatus[service.status]++;
                flag = true;
                if (service.status && service.status !== RequestStatus.SAVED
                  && service.status !== RequestStatus.INPROGRESS) {
                  cmpleteLen[ui._id]++;
                }
                // else if (service.status && service.status === RequestStatus.COMPLETE) {
                //   cmpleteLen[ui._id]++;
                // }
              })
              if (flag) {
                psIds[ui._id] = true;
                //isDisable[ui._id] = true;
              }
            } else {
              if (dataServices[ui._id].data.length > 0) isSwitch[ui._id] = true;

              dataServices[ui._id].data.forEach(service => {
                serviceStatus[service.status]++;
                flag = true;
                if (service.status && service.status !== RequestStatus.SAVED
                  && service.status !== RequestStatus.INPROGRESS) {
                  cmpleteLen[ui._id]++;
                }

                if (flag) {
                  psIds[ui._id] = true;
                  //isDisable[ui._id] = true;
                }
                // else if (service.status && service.status === RequestStatus.COMPLETE) {
                //   cmpleteLen[ui._id]++;
                // }
              });
            };
          } else {

            if (isSwitch[ui._id] !== undefined) {
              isSwitch[ui._id] = isSwitch[ui._id];
            } else {
              if (dataServices[ui._id].data.length > 0) isSwitch[ui._id] = true;
            }

            psIds[ui._id] = isSwitch[ui._id];
          }
        } else {

          if (isSwitch[ui._id] !== undefined) {
            isSwitch[ui._id] = isSwitch[ui._id];
          }
        }
      });

      const GridFields = service => {
        let stages = ds[packageType][service._id] ? ds[packageType][service._id].stage : [];
        let colValues = [];
        if (service.details[0].main != undefined) {
          colValues = cleanColValues(service.details[0].main);
        }
        else {
          colValues = cleanColValues(service.details);
        }
        return (
          <GridComponent
            dataDefault={dataDefault[packageType]}
            history={history}
            pendingServices={pendingServices}
            service={service}
            dataServices={ds[packageType]}
            status={this.state.status}
            colValues={colValues}
            stages={stages}
            others={others}
            onSubmitRequest={this.onSubmitRequest}
            onApproveUpdate={this.onApproveUpdate}
            onRowUpdate={this.onRowUpdate}
          />
        );
        if (service._id === "firewall" && status === RequestStatus.NEW) {
          return (
            <FirewallForm
              history={history}
              pendingServices={pendingServices}
              service={service}
              dataServices={ds[packageType]}
              status={this.state.status}
              colValues={colValues}
              onSubmitRequest={this.onSubmitRequest}
              onApproveUpdate={this.onApproveUpdate}
              onRowUpdate={this.onRowUpdate}
            />
          )
        }
        else {

        }
      };

      const TabInfo = uiServices.map((service, i) => {
        if (!service.enable) return <></>;

        let tabInfoStyle = { marginBottom: "10px" };
        let icon = "fa fa-" + service.variant + " fa-lg";
        if (i === 0 && this.state.status !== RequestStatus.SAVED && this.state.status !== RequestStatus.NEW && this.state.status !== RequestStatus.INPROGRESS) {
          tabInfoStyle["marginTop"] = "50px";
        }

        return (
          <Row style={tabInfoStyle} key={service._id + i} >
            <Col xs="12" >
              <Card id={service._id}>
                <CardHeader>
                  <i className={icon}>
                    <span style={{ marginLeft: "10px" }}>{service.title}</span>
                    {/* <span style="display: block;margin-left: 28px;margin-top: 6px;font-size: 12px;font-style: italic;">(BID20190524-10)</span> */}
                    <span style={{ display: 'block', marginLeft: "30px", marginTop: "6px", fontSize: "11px" }}>{this.state.id}</span>
                  </i>
                  <div className="card-header-actions">
                    <AppSwitch
                      onChange={() => { this.switchPanel(service._id); }}
                      variant={'pill'}
                      label={true} color={'success'}
                      size={'lg'}
                      dataOn={"Shrink"}
                      dataOff={"Expand"}
                      checked={isSwitch[service._id]}
                    />
                  </div>
                </CardHeader>
                <Collapse isOpen={isSwitch[service._id]}>
                  <CardBody>
                    {GridFields(service)}
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>
        )
      });
      return (
        <div className="animated fadeIn" >
          <ScrollUpButton />
          <div style={this.state.btnStyle}>
            <div>
              {uiServices.map((service, i) =>
                (!service.enable) ? <></> :
                  <Button
                    style={{
                      padding: "0.375rem",
                      fontSize: "0.8rem",
                      backgroundColor: totalLen[service._id] !== undefined && totalLen[service._id] > 0 ? "#4dbd74" : "",
                      borderColor: totalLen[service._id] !== undefined && totalLen[service._id] > 0 ? "#3a9d5d" : "#73818f"
                    }}
                    onClick={() => {
                      this.scrollToService(service._id);
                    }}
                    key={i}>
                    {(this.state.status !== RequestStatus.WORKLIST || psLen[service._id] == undefined || psLen[service._id] < 1) ? "" :
                      <span style={{
                        position: "absolute",
                        minWidth: "10px",
                        padding: "1px 5px",
                        fontSize: "9px",
                        fontWeight: "700",
                        color: "white",
                        textAlign: "center",
                        backgroundColor: "#a73a3a",
                        borderRadius: "10px",
                        marginLeft: "-7px",
                        marginTop: "-12px",
                      }}>{psLen[service._id]}</span>

                    }

                    <span
                    >{service.title + " "}
                      {(this.state.status !== RequestStatus.INPROGRESS || totalLen[service._id] == undefined || totalLen[service._id] < 1) ? "" :
                        <div style={{
                          position: "relative",
                          minWidth: "10px",
                          padding: "2px 6px",
                          fontSize: "10px",
                          fontWeight: "700",
                          color: "white",
                          textAlign: "center",
                          backgroundColor: "#777777",
                          borderRadius: "10px",
                          display: "inline",
                        }}>
                          <span style={{ color: "#c7c7c7" }}>{cmpleteLen[service._id]}</span>
                          <span style={{ color: "#92ab9a", marginLeft: "2px" }}>/</span>
                          <span style={{ color: "#EEEEEE", marginLeft: "2px" }}>{totalLen[service._id]}</span>
                        </div>}
                    </span>
                  </Button>
              )}
            </div>
          </div>

          <Row style={{ marginBottom: "10px" }}>
            <Col xs="12" >
              {this.state.status === RequestStatus.NEW &&
                <Button type="save"
                  size="sm"
                  style={btnStyle}
                  color="primary"
                  onClick={() => {
                    let aaa = this.submitValidation();
                    if (_.isEmpty(aaa)) {
                      this.setState({ validationfailed: true });;
                    } else {
                      console.log(aaa);
                      this.handleSubmit("saved", aaa);//this.submitValidation())
                    }
                  }
                    //onClick={() => this.handleSubmit("saved", this.props.ds[this.state.packageType])
                  }>
                  <i className="fa fa-disk" > </i> Save
              </Button >}
              {
                (this.state.status === RequestStatus.SAVED || this.state.status === RequestStatus.NEW) &&
                <Button type="submit"
                  size="sm"
                  style={btnStyle}
                  color="success"
                  onClick={() => {
                    let aaa = this.submitValidation();
                    if (_.isEmpty(aaa)) {
                      this.setState({ validationfailed: true });;
                    } else {
                      this.handleSubmit("inprogress", aaa);//this.submitValidation())
                    }
                  }
                  }>
                  <i className="fa fa-dot-circle-o" > </i> Submit
              </Button>}
              {this.state.status === RequestStatus.INPROGRESS &&
                serviceStatus.complete === 0 &&
                <Button type="reset"
                  // disabled={}
                  size="sm"
                  color="danger"
                  style={btnStyle}
                  onClick={() => this.xxx("withdrawn")} >
                  <i className="fa fa-ban" > </i> Withdraw
              </Button >}
              {
                this.state.status === RequestStatus.INPROGRESS &&
                serviceStatus.inprogress === 0 &&
                serviceStatus.saved === 0 &&

                <Button type="reset"
                  size="sm"
                  color="primary"
                  style={btnStyle}
                  onClick={() => this.xxx("towithdrawn")} >
                  <i class="fa fa-share-square"></i> to WITHDRAWN
              </Button >}
              {
                this.state.status === RequestStatus.INPROGRESS &&
                serviceStatus.complete > 0 && //at least one completed request exist
                serviceStatus.inprogress === 0 &&
                serviceStatus.saved === 0 &&
                <Button type="reset"
                  size="sm"
                  color="primary"
                  style={btnStyle}
                  onClick={() => this.xxx("tocompleted")} >
                  <i class="fa fa-share-square"></i> to COMPLETED
              </Button >}
              {
                (this.state.status === RequestStatus.SAVED) &&
                <Button type="reset"
                  size="sm"
                  color="danger"
                  style={btnStyle}
                  onClick={() => this.xxx("delete")} >
                  < i className="fa fa-ban" > </i> Delete
              </Button >}
            </Col>
          </Row>

          {TabInfo}
          {
            this.state.validationfailed &&
            <SweetAlert
              warning
              title="Nothing to submit!"
              onConfirm={this.closeValidationFailed}>
              Please, enter request values!
            </SweetAlert>
          }
          {
            this.state.alert &&
            <SweetAlert
              showCancel
              confirmBtnText="Yes"
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              onConfirm={() => {
                this.handleSubmit(this.state.confirmStr);
              }}
              onCancel={() => { this.setState({ alert: false }) }}>
              Are you sure you want to
              {this.state.confirmStr === "withdrawn" ? " withdraw the bundle" :
                this.state.confirmStr === "towithdrawn" ? ` mark the bundle as "withdrawn"` :
                  this.state.confirmStr === "tocompleted" ? ` mark the bundle as "completed"` :
                    this.state.confirmStr
              } ?
            </SweetAlert>
          }
        </div >
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    configBundleUI: state.requestReducer.configBundleUI,
    configRequestUI: state.requestReducer.configRequestUI,
    ui: state.requestReducer.uiServices,
    ds: state.requestReducer.dataServices,
    dataDefault: state.requestReducer.dataDefault,
    pendingServices: state.requestReducer.pendingServices,
    history: state.requestReducer.history,
    initData: state.requestReducer.initData,
    initStages: state.requestReducer.initStages,
    others: state.requestReducer.others,
    updated: state.requestReducer.updated,
    loadedUI: state.requestReducer.loadedUI
  }
}

export default connect(
  mapStateToProps
)(NewRequest)