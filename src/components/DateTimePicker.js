import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { Container, Columns } from 'react-bulma-components';

class DateTimePicker extends Component {
    render() {
        return (
            <Container>
                <Columns>
                    <Columns.Column>
                        <DatePicker onChange={this.props.onDateChange} value={this.props.selectedDate}/>
                    </Columns.Column>
                    <Columns.Column>
                        <TimePicker amPmAriaLabel="Select AM/PM" clearAriaLabel="Clear value" disableClock={true} onChange={this.props.onDateChange} value={this.props.selectedDate}/>
                    </Columns.Column>
                </Columns>
            </Container>
        );
    }
}

export default DateTimePicker;