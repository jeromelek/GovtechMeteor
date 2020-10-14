import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import LocationList from './LocationList';

class LocationData extends Component {
    constructor(props) {
        super(props);
        this.state = { trafficImages: [], locationMetadata: [], weatherData: [], date: new Date()}
    }

    //This method calls the traffic cam API and returns an array of Cameras with their respective images, location and timestamp
    fetchTrafficImages(){
        fetch("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + this.props.date.toISOString().split('.')[0])
            .then(res => res.json())
            .then((results) => {
                this.fetchReverseLocation(results.items[0].cameras)}
            );
    }

    // This method uses the array of cameras and adds all the information into the array.
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
                            trafficImages[i].weather = this.getWeather(trafficImages[i].area);
                        }else{
                            trafficImages[i] = null;
                        }
                        this.setState({trafficImages : trafficImages});
                });
            }
        }
    }

    //This method calls the weather API to return the current weather
    fetchWeather(){
        fetch("https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" + this.props.date.toISOString().split('.')[0])
        .then(res => res.json())
        .then((result) => {
            this.setState({ locationMetadata: result.area_metadata, weatherData: result.items[0].forecasts});
        },
            (error) => {
                console.log(error)
            }
        );    
    }

    //This method uses the weatherData and returns the current weather
    getWeather(area){
        for(let i = 0; i < this.state.weatherData.length; i++){
            if(this.state.weatherData[i].area === area){
                return this.state.weatherData[i].forecast;
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

    //This method converts text to title case. It is used because the Onemap API returns all uppercase text
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    //This is a comparator method for sorting of the arrays
    roadComparator(a, b){
        if(a.road > b.road){
            return 1;
        }else if(a.road < b.road){
            return -1;
        }
        if(a.area > b.area){
            return 1;
        }else if(a.area < b.area){
            return -1;
        }
        return 0;
    }

    componentDidUpdate(){
        if(this.props.date !== this.state.date){
            this.setState({date: this.props.date}, () => {
                this.fetchWeather();
                this.fetchTrafficImages();
                console.log("update completed");
            });
        }
    }

    componentDidMount() {
        this.fetchWeather();
        this.fetchTrafficImages();
    }

    render() {
        //Filter the array to only return results (ignores null)
        let filteredArray = this.state.trafficImages.filter(function (el) {
            return el != null;
        });

        //Sort array based on comparator of road name, then area.
        filteredArray.sort(this.roadComparator);

        return (
            <Container>
                <LocationList items={filteredArray}/>
            </Container>
        );

    }
}

export default LocationData;