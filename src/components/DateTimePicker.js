import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { Container, Columns } from 'react-bulma-components';

class DateTimePicker extends Component {
    state = { selectedDate: new Date(), selectedTime: new Date()}

    onDateChange = selectedDate => {
        this.setState({selectedDate});
    }

    onTimeChange = selectedTime => {
        let date = this.state.selectedDate;
        let hour = selectedTime.substring(0, 2);
        let minute = selectedTime.substring(3, 5);
        date.setHours(hour);
        date.setMinutes(minute);
    }
    
    render() {
        const { selectedDate, selectedTime } = this.state;

        return (
            <Container>
                <Columns>
                    <Columns.Column>
                        <DatePicker onChange={this.onDateChange} value={selectedDate}/>
                    </Columns.Column>
                    <Columns.Column>
                        <TimePicker amPmAriaLabel="Select AM/PM" clearAriaLabel="Clear value" disableClock="true" onChange={this.onTimeChange} value={selectedTime}/>
                    </Columns.Column>
                </Columns>
            </Container>
        );
    }
}

export default DateTimePicker;