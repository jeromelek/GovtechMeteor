import React, { Component } from 'react';
import { Section, Container } from 'react-bulma-components';

class LocationData extends Component {
    constructor() {
        super();
        this.state = { trafficImages: [], locationMetadata: [], weatherData: [] }
    }

    componentDidMount() {
        fetch("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((result) => {
                this.setState({ trafficImages: result.items });
            },
                (error) => {
                    console.log(error)
                }
            );
        
        fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((result) => {
                this.setState({ locationMetadata: result.area_metadata, weatherData: result.items});
            },
                (error) => {
                    console.log(error)
                }
            );
    
    
    }

    render() {
        return (
            <Section>
                <Container>
                    LocationView
                </Container>
            </Section>
        );

    }
}

export default LocationData;