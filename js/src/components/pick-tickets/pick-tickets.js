import React, { Component } from 'react';
import {Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, Well} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';

export default class TestLayout extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tickets: []
        }
    }

    onChartClick(section) {
        if(section.length > 0) {
            TTTPost('/tickets', {
                section_number: section
            })
            .then(res => {
                if (res.data.tickets) this.setState({tickets: res.data.tickets});
            });
        }
    }

    renderTickets() {
        return _.map(this.state.tickets, (ticket, index) =>
            <option value={ticket.ticket_id}>
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number}
            </option>
        );
    }

    render(){
        return (

            <Grid>
                <h1 style={{textAlign: 'center',color: 'white'}}>
                    <Well style={{background: '#1E2FA4'}} > Choose Your Desired Section From The Seating Chart </Well>
                </h1>
                <Row>
                    <Col lg={8}>
                        <WellsFargoChart onSectionSelected={this.onChartClick.bind(this)}/>
                    </Col>
                    <Col lg={4}>
                        {<div>
                            <FormGroup controlId="formControlsSelectMultiple">
                                <ControlLabel>Here are your ticket options for selected section: </ControlLabel>
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