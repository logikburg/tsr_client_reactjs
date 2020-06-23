import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

class LeaveCommentModal extends React.Component {
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
    this.props.fnActionDialog("");
  }

  done() {
    this.props.fnAddComment("comment", this.state.comment, this.state.notifyRequester ? true : undefined);
    this.hide();
  }

  requestInfo() {
    this.props.fnAddComment(this.props.action, this.state.comment, this.state.notifyRequester ? true : undefined);
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
    let { status, canApprove, className, memberOfSupport, isSupportHandlingStage } = this.props;

    return (
      <Modal keyboard={false}
        toggle={() => { this.hide() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader toggle={() => this.hide()}> Leave Comment</ModalHeader>
        <ModalBody>
          <Container>
            {
              memberOfSupport && isSupportHandlingStage === true &&
              <Row style={{ marginBottom: "10px", }}>
                <Col>
                  <Select
                    placeholder="Add Comment"
                    options={this.options}
                    type="text"
                    className={"modalcompoent-select"}
                    isSearchable
                    isClearable
                    onChange={this.onChange}
                    value={this.state.commentType} />
                </Col>
              </Row>
            }
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <Input
                  placeholder={canApprove ? "Approval Comment" : "Comment here...."}
                  type="textarea"
                  rows={8}
                  onChange={this.handleChange}
                  //onChange={(event) => this.addComment(event, canApprove ? "approve" : (status === "inprogress" ? "withdraw" : "reject"))}
                  value={this.state.comment} />
              </Col>
            </Row>
            <Row style={{ marginLeft: "6px", color: "#666666", fontStyle: "italic" }}>
              <Col>
                <Input
                  id="checkbox_notify_users"
                  type="checkbox"
                  onChange={this.notifyUser} />{' '}
                <Label htmlFor='checkbox_notify_users'>Send notification to users</Label>
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
                onClick={() => { this.props.action === "comment" ? this.done() : this.requestInfo() }}>Done
                {/* onClick={() => this.done()}>Done */}
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
)(LeaveCommentModal);

