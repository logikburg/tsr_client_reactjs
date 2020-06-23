import React from 'react';
import { Button, Container, Row, Col, Modal, Input, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from 'react-redux';
import 'react-day-picker';
import {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import 'react-day-picker/lib/style.css';

class ExtendedDateModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      extendedDate: new Date(),
    };
    this.handleDayChange = this.handleDayChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  hide() {
    this.props.fnActionDialog("");
  }

  handleDayChange(selectedDay) {
    this.setState({
      extendedDate: selectedDay
    });
  }

  onSubmit() {
    let { fnApply } = this.props;
    console.log('onSubmit > ');
    fnApply(this.state.extendedDate);
    this.hide();
  }

  render() {

    let { className } = this.props;
    const { extendedDate } = this.state;

    return (
      <Modal keyboard={false}
        toggle={() => { this.hide() }}
        className={className}
        isOpen={this.state.isOpen}
        modalTransition={{ timeout: 1 }}>
        <ModalHeader toggle={() => this.hide()}>Extended Agreed Date</ModalHeader>
        <ModalBody>
          <Container>
            <Row style={{ marginBottom: "10px" }}>
              <Col>
                <label>Please choose date : &nbsp;</label>
                <DayPickerInput
                  value={extendedDate}
                  onDayChange={this.handleDayChange}
                  formatDate={formatDate}
                  parseDate={parseDate}
                  placeholder={`MM/DD/YYYY`}
                  dayPickerProps={{
                    selectedDays: extendedDate,
                    disabledDays:
                      [
                        { daysOfWeek: [0, 6] },
                        {
                          before: new Date()
                        }
                      ]
                  }}
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
                disabled={this.state.comment === ""}
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
)(ExtendedDateModal);

