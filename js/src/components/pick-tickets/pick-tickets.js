import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            section: '',
            tickets: []
        }
    }

    onChartClick(section) {
        if(section.length > 0) {
            TTTPost('/tickets', {
                section_number: section
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    section: section,
                    tickets: res.data.tickets
                });
            });
            
        }
    }

    renderTickets() {
        return _.map(this.state.tickets, (ticket, index) =>
            <option key={index} value={ticket.ticket_id}>
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number}
            </option>
        );
    }

    render(){
        return (
            <Grid>
                <h1 className="border-white">
                    <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                        Choose Your Desired Section From The Seating Chart 
                    </Well>
                </h1>
                <Row>
                    <Col lg={8}>
                        <WellsFargoChart 
                        onSectionSelected={this.onChartClick.bind(this)} 
                        selectedSection={this.state.section}/>
                    </Col>
                    <Col lg={4}>
                        {<div>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel style={{color: 'white', fontSize: 25}}>Here are your ticket options for selected section: </ControlLabel>
                                <FormControl style={{height: '650px'}} componentClass="select" multiple>
                                {this.renderTickets()}
                                </FormControl>
                            </FormGroup>
                        </div>}
                    </Col>
                </Row>
            </Grid>
        );
    }
}