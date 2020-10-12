import { Component } from 'react';

class LocationData extends Component {
    constructor() {
        super();
        this.state = { jsonResults: [] }
    }

    componentDidMount() {
        fetch("https://api.data.gov.sg/v1/transport/traffic-images?date_time=" + this.props.date)
            .then(res => res.json())
            .then((result) => {
                this.setState({ jsonResults: result.totalCount });
            },
                (error) => {
                    console.log(error)
                });
    }

    render() {
        return this.state.jsonResults;
    }
}

export default LocationData;