import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';

class HandleRequestModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleHoursChange = this.handleHoursChange.bind(this);
    this.complete = this.complete.bind(this);
    this.state = {
      isOpen: this.props.isOpen,
      manHours: 0,
      valid: true
    };
  }

  hide() {
    this.props.fnActionDialog("");
  }

  handleHoursChange(evt) {
    let _nmber = evt.target.value;
    let valid = !evt.currentTarget.validity.badInput;
    console.log("evt.currentTarget.validity.valid", evt.currentTarget.validity.valid);
    this.setState({ valid: valid })
    if (evt.nativeEvent.inputType == "deleteContentBackward") {
      this.setState({ manHours: _nmber });
    }
    else {
      let t = _nmber.split(".");
      let newT;
      if (!valid) {
        newT = this.state.manHours;
        this.setState({ manHours: newT, valid: true });
      }
      else if (t.length === 2) {
        t[1] = t[1].substring(0, 2);
        newT = t.join(".");
        this.setState({ manHours: newT });
        // this.setState({ manHours: parseFloat(_nmber) });
      }
      else
        this.setState({ manHours: _nmber });
    }
  }

  complete(e) {
    let { fnApply } = this.props;
    this.hide();
    const _manHours = parseFloat(this.state.manHours);
    fnApply("complete", _manHours);
  }

  // handleKeyDown(evt) {
  //   let kC = evt.keyCode;
  //   var _nmber = evt.target.value;
  //   console.log('kC ', kC);
  //   console.log("_nmber ", _nmber);
  //   if ((kC > 47 && kC < 58)) {
  //     this.setState({ manHours: parseFloat(_nmber).toFixed(1) });
  //   }
  //   else if (kC == 190) {
  //     this.setState({ manHours: _nmber });
  //   }
  // }


  render() {

    let { className } = this.props;
    const { manHours } = this.state;

    return (
      <Modal keyboard={false}
        toggle={() => { this.hide() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader toggle={() => this.hide()}>Input Man Hours</ModalHeader>
        <ModalBody>
          <Container>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <label>How many hours to complete this request : &nbsp;</label>
                {/* onChange={this.handleHoursChange} */}
                <Input type="number" name="hours" value={manHours}
                  min="0"
                  onChange={this.handleHoursChange}
                />
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Row style={{ marginBottom: "10px" }}>
            <Col xs="auto">
              <Button
                style={{ marginRight: "7px" }}
                disabled={!this.state.valid}
                color="primary"
                onClick={this.complete}>Complete
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
)(HandleRequestModal);

