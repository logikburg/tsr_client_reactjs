import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

class ActionCommentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      comment: "",
      notifyRequester: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.notifyUser = this.notifyUser.bind(this);
    this.options = this.props.templates;
  }

  hide() {
    this.props.fnDismiss();
  }

  done() {
    let { action } = this.props;
    let _data = { action_comment: this.state.comment };
    this.props.fnApply(action, _data);
    this.hide();
  }

  onChange(e) {
    this.setState({ comment: e ? e.value : "" });
  }

  handleChange(event) {
    this.setState({ comment: event.target.value });
  }

  notifyUser(e) {
    this.setState({ notifyRequester: e.target.checked });
  }

  render() {
    let { status, canApprove, className } = this.props;

    return (
      <Modal keyboard={false}
        toggle={() => { this.hide() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader style={{ color: "#f86c6b" }} toggle={() => this.hide()}>{this.props.title}</ModalHeader>
        <ModalBody>
          <Container>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <Label style={{ fontSize: "1.25rem" }}>{this.props.message}</Label>
              </Col>
            </Row>

            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <Input
                  placeholder={"Comment here...."}
                  type="textarea"
                  rows={6}
                  onChange={this.handleChange}
                  value={this.state.comment} />
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
                color="danger"
                onClick={() => this.done()}>Yes
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
)(ActionCommentModal);

