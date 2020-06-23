import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

class AddAttachmentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      comment: "",
    };
  }

  isShow() {
    this.props.fnActionDialog("");
  }

  render() {

    let { status, canApprove, className } = this.props;

    return (
      <Modal keyboard={false}
        toggle={() => { this.isShow() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader toggle={() => this.isShow()}>Add Attachment</ModalHeader>
        <ModalBody>
          <Container>
            <Row style={{ marginBottom: "10px", }}>
              <Col>
                <Input type="file" id="file-input" name="file-input" className="btn btn-light" />
              </Col>
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Col>

                <Button
                  color="secondary"
                  onClick={() => console.log("Done")}>Upload
                    </Button>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="auto">
              <Button
                style={{ marginRight: "7px" }}
                disabled={this.state.comment === ""}
                color="primary"
                onClick={() => console.log("Done")}>Done
                    </Button>

              <Button
                color="secondary"
                onClick={() => this.isShow()}>Cancel
                    </Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    )
  }
}
export default connect(
)(AddAttachmentModal);

