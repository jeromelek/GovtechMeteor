import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { Container, Col, Row } from 'react-bootstrap';

class DateTimePicker extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <DatePicker onChange={this.props.onDateChange} value={this.props.date}/>
                    </Col>
                    <Col>
                        <TimePicker amPmAriaLabel="Select AM/PM" clearAriaLabel="Clear value" disableClock={true} onChange={this.props.onDateChange} value={this.props.date}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default DateTimePicker;