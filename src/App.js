import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Jumbotron, Navbar } from 'react-bootstrap';
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
      <div className="bg-light">
        <Navbar bg="dark" variant="dark" className="shadow-sm">
          <Container className="d-flex justify-content-between">
            <Navbar.Brand>
              <strong>Meteor Assessment</strong>
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Jumbotron className="text-center bg-white">
          <Container>
            <h1>Traffic Cam and Weather Forecast</h1>
            <p className="lead text-muted">Select date and time to view information.</p>
            <DateTimePicker onDateChange={this.onDateChange} date={this.state.date} />
          </Container>
        </Jumbotron>
        
        <Container className="bg-light text-center">
          <LocationData date={this.state.date} />
        </Container>
      </div>
    );
  }
}

export default App;
