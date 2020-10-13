import React, { Component } from 'react';
import { Col, Container, Card, CardDeck, Row } from 'react-bootstrap';

class LocationData extends Component {
    constructor(props) {
        super(props);
        this.state = { trafficImages: [], locationMetadata: [], weatherData: [], date: new Date() }
    }

    //This method calls the traffic cam API and returns an array of Cameras with their respective images, location and timestamp
    fetchTrafficImages(){
        fetch("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((results) => {
                this.fetchReverseLocation(results.items[0].cameras)}
            );
    }

    // This method uses the array of cameras and adds the reverse lookup location information into the array.
    fetchReverseLocation(trafficImages){
        if(trafficImages == null) return;
        for (let i = 0; i < trafficImages.length; i++){
            if(trafficImages[i] != null){
                fetch("https://developers.onemap.sg/privateapi/commonsvc/revgeocode?location=" + trafficImages[i].location.latitude + "," + trafficImages[i].location.longitude + "&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY0NzUsInVzZXJfaWQiOjY0NzUsImVtYWlsIjoiamxla0BhbmRyZXcuY211LmVkdSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTYwMjU1NDUxMywiZXhwIjoxNjAyOTg2NTEzLCJuYmYiOjE2MDI1NTQ1MTMsImp0aSI6IjlhMmQyZWZhNjBmN2E2MDJhZDc5MTlmZjdlYjQxZTQ3In0.E4lIZ38RaAxyCiLdNkZQD42AAE4BXoMcrymnF1gy7k0")
                    .then(res => res.json())
                    .then((result) => {
                        if(result.GeocodeInfo[0] != null){
                            trafficImages[i].road = this.toTitleCase(result.GeocodeInfo[0].ROAD);
                            trafficImages[i].area = this.getArea(trafficImages[i].location);
                        }else{
                            trafficImages[i] = null;
                        }
                        this.setState({trafficImages : trafficImages});
                });
            }
        }
    }

    // This method uses the array of cameras and returns the nearest area.
    getArea(lookupLocation){
        if(lookupLocation == null) return;
        
        let area = this.state.locationMetadata[0];
        let minDistance = this.calDistance(lookupLocation.latitude, lookupLocation.longitude, area.label_location.latitude, area.label_location.longitude);

        for (let i = 1; i < this.state.locationMetadata.length; i++){
            let distance = this.calDistance(lookupLocation.latitude, lookupLocation.longitude, this.state.locationMetadata[i].label_location.latitude, this.state.locationMetadata[i].label_location.longitude);
            if(distance < minDistance){
                area = this.state.locationMetadata[i];
                minDistance = distance;
            }
        }

        return area.name;
    }

    //This method calculates the distance between two points
    calDistance(lat1, lon1, lat2, lon2) {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            let radlat1 = Math.PI * lat1/180;
            let radlat2 = Math.PI * lat2/180;
            let theta = lon1-lon2;
            let radtheta = Math.PI * theta/180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist;
        }
    }

    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    componentDidUpdate(){
        if(this.props.date !== this.state.date){
            this.setState({date: this.props.date});
            this.fetchTrafficImages();
            console.log("update completed");
        }
        
    }

    componentDidMount() {
        fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((result) => {
                this.setState({ locationMetadata: result.area_metadata, weatherData: result.items[0].forecasts});
            },
                (error) => {
                    console.log(error)
                }
            );    
        this.fetchTrafficImages();
    }


    render() {
        let filteredArray = this.state.trafficImages.filter(function (el) {
            return el != null;
        });

        const listItems = filteredArray.map((trafficImage) => 
            <Col key={trafficImage.camera_id}>
                <Card style={{width: '18rem'}} className='mx-auto mb-4'>
                    <Card.Img style={{height: '12rem'}} variant="top" src={trafficImage.image} />
                    <Card.Body>
                        <Card.Title>{trafficImage.road}</Card.Title>
                        <Card.Body>{trafficImage.area}</Card.Body>
                        <Card.Link>View Weather</Card.Link>
                    </Card.Body>
                </Card>
            </Col>
        );

        return (
            <Container>
                <Row className='mx-auto'>
                    <CardDeck className='mx-auto'>
                        {listItems}
                    </CardDeck>
                </Row>
                
            </Container>
        );

    }
}

export default LocationData;