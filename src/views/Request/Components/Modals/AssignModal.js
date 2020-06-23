import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

class AssignModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      assignTo: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  hide() {
    this.props.fnActionDialog("");
  }

  onChange(vlus) {
    console.log('e.value > ', vlus);
    this.setState({ assignTo: vlus });
  }

  onSubmit() {
    let { fnApply, assignType } = this.props;
    console.log('onSubmit > ');
    fnApply("assign", this.state.assignTo, assignType);
    this.hide();
  }

  render() {

    let { className, members } = this.props;
    let options = [];
    if (members !== undefined) members.forEach((it) => {
      options.push({ value: it.userid, label: it.displayname });
    });

    return (
      <Modal keyboard={false}
        toggle={() => { this.hide() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader toggle={() => this.hide()}>Assign {this.props.assignType === "AssignSupervisor" ? "Supervisor" : "Support"}</ModalHeader>
        <ModalBody>
          <Container>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <label>Please choose the assignee:</label>
                <Select
                  placeholder="..."
                  options={options}
                  onChange={this.onChange}
                  // isMulti
                  type="text"
                  className={"modalcompoent-select"}
                  isSearchable
                  isClearable />
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="auto">
              <Button
                style={{ marginRight: "7px" }}
                color="primary"
                onClick={this.onSubmit}>Submit
                    </Button>

              <Button
                color="secondary"
                onClick={() => this.hide()}>Cancel
                    </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    )
  }
}
export default connect(
)(AssignModal);

