import React, { Component } from 'react';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Columns, Container, Navbar, Section } from 'react-bulma-components';
import DateTimePicker from "./components/DateTimePicker";
import LocationData from "./components/LocationData";

class App extends Component {
  constructor() {
    super();
    this.onDateChange = this.onDateChange.bind(this);
    this.state = { date: new Date() }
  }

  onDateChange(newInput) {
    let newDateTime = new Date(this.state.date);

    if (newInput != null) {
      if (typeof (newInput) == "string") {
        let hour = newInput.substring(0, 2);
        let minute = newInput.substring(3, 5);
        newDateTime.setHours(hour);
        newDateTime.setMinutes(minute);
      } else {
        newDateTime.setDate(newInput.getDate());
        newDateTime.setMonth(newInput.getMonth());
        newDateTime.setFullYear(newInput.getFullYear());
      }
      this.setState({ date: newDateTime })
    }
  }

  render() {
    return (
      <div>
        <Navbar className="navbar is-dark is-spaced">
          <Navbar.Brand>
            <Navbar.Item className="is-transparent">
              <h1 className="title is-1 has-text-white">Meteor Assessment</h1>
            </Navbar.Item>
          </Navbar.Brand>
        </Navbar>

        <Section>
          <Container>
            <Columns>
              <h1 className="title is-2">Select date and time to view information</h1>
            </Columns>
            <Columns>
              <DateTimePicker onDateChange={this.onDateChange} date={this.state.date} />
            </Columns>
          </Container>
        </Section>

        <Section>
          <Container>
            <Columns>
              <h1 className="title is-2">List of Locations</h1>
            </Columns>
            <Columns>
              <LocationData date={this.state.date} />
            </Columns>
          </Container>
        </Section>
      </div>

    );
  }
}

export default App;
