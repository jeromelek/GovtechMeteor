import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { Container, Col, Row } from 'react-bootstrap';

class DateTimePicker extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col md={4}/>
                    <Col>
                        <DatePicker onChange={this.props.onDateChange} value={this.props.date} clearIcon={null}/>
                    </Col>
                    <Col>
                        <TimePicker clearIcon={null} disableClock={true} onChange={this.props.onDateChange} format={"hh:mm:ss a"} value={this.props.date}/>
                    </Col>
                    <Col md={4}/>
                </Row>
            </Container>
        );
    }
}

export default DateTimePicker;