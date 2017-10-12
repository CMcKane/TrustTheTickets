import React, { Component } from 'react';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import '../seating-chart.css';
import WellsFargoChart from './wells-fargo-chart';

export default class TestLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedSection: ''
        }
    }

    onChartClick(section) {
        if(section.length > 0) this.setState({selectedSection: section});
    }

    render(){
        return (

            <Grid>
                <h1 style={{textAlign: 'center'}}>
                    Choose Your Desired Section From The Seating Chart
                </h1>
                <Row>
                    <Col lg={8}>
                        <WellsFargoChart onSectionSelected={this.onChartClick.bind(this)}/>
                    </Col>
                    <Col lg={4}>
                        {<div>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel>Here are your ticket options for selected section: </ControlLabel>
                                <FormControl componentClass="select" multiple>
                                    <option value="Ticket 1">Ticket 1</option>
                                    <option value="Ticket 2">Ticket 2</option>
                                    <option value="Ticket 3">Ticket 3</option>
                                </FormControl>
                            </FormGroup>
                        </div>}
                    </Col>
                </Row>
            </Grid>
        );
    }
}