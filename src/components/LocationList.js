import React, { Component } from 'react';
import { Col, Card, CardDeck, Fade, Form, Row } from 'react-bootstrap';

class LocationList extends Component {
    constructor(props) {
        super(props);
        this.state = {filtered: []};
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount() {
        this.setState({
          filtered: this.props.items
        });
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
          filtered: nextProps.items
        });
    }

    handleChange(e) {
		// Variable to hold the original version of the list
        let currentList = [];
        // Variable to hold the filtered list before putting into state
        let newList = [];
            
        // If the search bar isn't empty
        if (e.target.value !== "") {
            // Assign the original list to currentList
            currentList = this.props.items;
                
            // Use .filter() to determine which items should be displayed
            // based on the search terms
            newList = currentList.filter(item => {
            
                // change current item to lowercase
                const lc = item.road.toLowerCase();
                
                // change search term to lowercase
                const filter = e.target.value.toLowerCase();
                
                // check to see if the current list item includes the search term
                // If it does, it will be added to newList. Using lowercase eliminates
                // issues with capitalization in search terms and search content
                
                return lc.includes(filter);
            });
        } else {
            // If the search bar is empty, set newList to original task list
            newList = this.props.items;
        }
        
        // Set the filtered state based on what our rules added to newList
        this.setState({filtered: newList});
    }

    render() {
        return (
            <div>
                <Row className="pb-5">
                    <Form.Control type="text" size="lg" onChange={this.handleChange} placeholder="Search by Road Name..." />
                </Row>

                <Row>
                    <CardDeck className='mx-auto'>
                        {this.state.filtered.map(item => (
                            <Col key={item.camera_id}>
                                <Fade in={true}>
                                    <Card style={{width: '20rem', height: '25rem'}} className='mx-auto mb-4'>
                                        <Card.Img style={{height: '14rem'}} variant="top" src={item.image} />
                                        <Card.Body>
                                            <Card.Title style={{height: '3rem'}}>{item.road}</Card.Title>
                                            <Row>
                                                <Col xs={4}><p className="text-left">Region: </p></Col>
                                                <Col xs={8}><p className="text-left">{item.area}</p></Col>
                                            </Row>
                                            <Row>
                                                <Col xs={4}><p className="text-left">Weather: </p></Col>
                                                <Col xs={8}><p className="text-left">{item.weather}</p></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Fade>
                            </Col>
                        ))}
                    </CardDeck>
                </Row>

            </div>
        )
    }
}

export default LocationList;