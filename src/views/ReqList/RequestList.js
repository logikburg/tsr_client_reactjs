import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import { connect } from 'react-redux';
import { setBundleListDataLoading } from '../../_actions';

class RequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "saved",
      defaultColDef: { filter: true },
    }
    this.onGridReady = this.onGridReady.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { url } = this.props.match;
    let status = url.replace("/reqlist/", "");
    let user = JSON.parse(localStorage.getItem("user")).id;
    dispatch(setBundleListDataLoading(status, { user: user }))
    this.setState({ status: status });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.gridColumnApi.setColumnVisible('_id', false);
    // params.api.sizeColumnsToFit();
    // this.gridColumnApi.sizeColumnsToFit();
    //console.log("!!!", this.gridColumnApi)
  }

  serviceDetails(e) {
    const { url } = this.props.match;
    let status = url.replace("/reqlist/", "");
    let rowInfo = e.data;
    console.log("rowInfo", rowInfo);
    this.setState({
      redirect: "/reqlist/" + status + "/" + rowInfo.bundle_type + "/" + rowInfo.bundle_name
    })
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
  }

  render() {
    const { data } = this.props;
    let colValues = [];
    let rowValues = [];
    let rowValuesAnother = [];
    let style = {
      "width": "100%",
      "height": "300px"
    };

    if (data !== null && data !== undefined) {
      data.forEach(item => {
        let dataObj = {};
        Object.keys(item).forEach(field => {
          dataObj[field] = item[field];
        });
        if (this.state.status &&
          this.state.status === "inprogress" &&
          item["user"] !== JSON.parse(localStorage.getItem("user")).id) {
          rowValuesAnother.push(dataObj);
        } else {
          rowValues.push(dataObj);
        }
      });
      if (data[0]) {
        colValues.push({ headerName: "Bundle Name", field: "bundle_name" });
        colValues.push({ headerName: "Bundle Description", field: "bundle_description" });
        colValues.push({ headerName: "Status", field: "status" });
        colValues.push({ headerName: "Created By", field: "displayname" });
        colValues.push({ headerName: "Created Date", field: "date" });
        // Object.keys(data[0]).forEach((field) => {
        //   if (field === "status" || field === "bundle_type" || field === "bundle_ref") {
        //     colValues.push({ headerName: field, field: field, width: 100, filter: true });
        //   } else if (field === "_id") {

        //   } else {
        //     colValues.push({ headerName: field, field: field });
        //   }
        // });
      }
    }

    var displayCat, displayState, iconState;
    switch (this.state.status) {
      case 'saved':
        iconState = 'fa fa-save'
        displayCat = 'Bundles'
        displayState = 'Saved'
        break;
      case 'inprogress':
        iconState = 'fa fa-spinner'
        displayCat = 'Bundles'
        displayState = 'In Progress'
        break;
      case 'completed':
        iconState = 'fa fa-check-square-o'
        displayCat = 'Bundles'
        displayState = 'Completed'
        break;
      case 'withdrawn':
        iconState = 'fa fa-trash'
        displayCat = 'Bundles'
        displayState = 'Withdrawn'
        break;
      case 'worklist':
        iconState = 'fa fa-list-ul'
        displayCat = 'Actions'
        displayState = 'My Worklist'
        break;
      case 'handled':
        iconState = 'fa fa-check-square-o'
        displayCat = 'Actions'
        displayState = 'Handled Worklist'
        break;
      default:
        iconState = 'fa fa-save'
        displayCat = 'Other'
        displayState = this.state.status
    }

    return (
      <Row>
        {this.renderRedirect()}
        <Col xs="12">
          <Row>
            <Col xs="12">
              <Card>
                <CardHeader>
                  <span style={{ marginLeft: "10px" }}>{"My " + displayCat} - <i className={iconState}> {displayState}</i></span>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" >
                      <div className="ag-theme-balham"
                        style={style}>
                        <AgGridReact
                          onGridReady={this.onGridReady}
                          columnDefs={colValues}
                          floatingFilter={true}
                          rowData={rowValues}
                          onRowDoubleClicked={(e) => this.serviceDetails(e)}
                        >
                        </AgGridReact>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {this.state.status === "inprogress" &&
            < Row >
              <Col xs="12">
                <Card>
                  <CardHeader>
                    <span style={{ marginLeft: "10px" }}>{"Anothers' " + displayCat} - <i className={iconState}> {displayState}</i></span>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12" >
                        <div className="ag-theme-balham"
                          style={style}>
                          <AgGridReact
                            onGridReady={this.onGridReady}
                            columnDefs={colValues}
                            floatingFilter={true}
                            rowData={rowValuesAnother}
                            onRowDoubleClicked={(e) => this.serviceDetails(e)}
                          >
                          </AgGridReact>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          }
        </Col>
      </Row >
    )
  }
}
const mapStateToProps = (state) => {
  return {
    data: state.requestReducer.bundleData
  }
}

export default connect(
  mapStateToProps
)(RequestList);
