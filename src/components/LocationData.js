import React, { Component } from 'react';
import { Section, Container, Button } from 'react-bulma-components';

class LocationData extends Component {
    constructor(props) {
        super(props);
        this.state = { trafficImages: [], locationMetadata: [], weatherData: [], date: new Date() }
    }

    fetchTrafficImages(){
        fetch("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((results) => {
                this.fetchReverseLocation(results.items[0].cameras)});
    }

    fetchReverseLocation(trafficImages){
        for (let i = 0; i < trafficImages.length; i++){
            if(trafficImages[i] != null){
                fetch("https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=" + trafficImages[i].location.latitude + "," + trafficImages[i].location.longitude + "&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY0NzUsInVzZXJfaWQiOjY0NzUsImVtYWlsIjoiamxla0BhbmRyZXcuY211LmVkdSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTYwMjU1NDUxMywiZXhwIjoxNjAyOTg2NTEzLCJuYmYiOjE2MDI1NTQ1MTMsImp0aSI6IjlhMmQyZWZhNjBmN2E2MDJhZDc5MTlmZjdlYjQxZTQ3In0.E4lIZ38RaAxyCiLdNkZQD42AAE4BXoMcrymnF1gy7k0")
                    .then(res => res.json())
                    .then((result) => {
                        if(result.GeocodeInfo[0] != null){
                            trafficImages[i].road = result.GeocodeInfo[0].ROAD;
                        }else{
                            trafficImages[i] = null;
                        }
                        this.setState({trafficImages : trafficImages});
                });
            }
        }
    }

    componentDidUpdate(){
        if(this.props.date !== this.state.date){
            this.setState({date: this.props.date});
            this.fetchTrafficImages();
        }
    }

    componentDidMount() {
        this.fetchTrafficImages();
        /*fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((result) => {
                this.setState({ locationMetadata: result.area_metadata, weatherData: result.items[0].forecasts});
            },
                (error) => {
                    console.log(error)
                }
            );    */
    }


    render() {
        let filteredArray = this.state.trafficImages.filter(function (el) {
            return el != null;
        });

        const listItems = filteredArray.map((trafficImage) => <ul key={trafficImage.camera_id}>{trafficImage.road}</ul>);

        return (
            <Section>
                <Container>
                    {listItems}
                </Container>
            </Section>
        );

    }
}

export default LocationData;