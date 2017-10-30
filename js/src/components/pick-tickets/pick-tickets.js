import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well, Button} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import { TTTPost } from '../backend/ttt-request';
import { TTTGet } from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        this.state = {
            section: 112,
            tickets: [],
            price: 0
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    getTicketsWithFilter() {
        TTTPost('/pick-ticket-filter', {
            price: this.state.price,
            section: this.state.section
            })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
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

    firstComponentChangeValue(e) {
        console.log(e.target.value);
      this.setState({ 
        firstComponentCurrentValue: e.target.value,
        price: e.target.value
      });
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
            <Grid style={{paddingTop: "100px"}}>
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

                            <FormGroup controlId="formControlsEmail">

                                <ReactSliderNativeBootstrap
                                     max={1000}
                                     min={1}
                                     step={1}
                                     tooltip="hide"
                                     handleChange={this.firstComponentChangeValue.bind(this)}
                                     value={this.state.firstComponentCurrentValue}
                                />

                                <ControlLabel
                                    id = "sliderPrice"
                                    style={{color: 'white', fontSize: 15}}>
                                    Ticket Price: ${this.state.price}
                                </ControlLabel>

                                    <div>
                                        <div2>
                                            <ControlLabel
                                                id = "sectionNumber"
                                                style={{color: 'white', fontSize: 15}}>
                                                Section Number:
                                            </ControlLabel>
                                        </div2>
                                        <div2>
                                            <FormControl style={{width: 50}} placeholder="Enter section #" type="section"
                                                value={this.state.section}
                                                name="section"
                                                onChange={this.handleChange.bind(this)}  />
                                        </div2>
                                    </div>

                                    <div>
                                        <Button bsStyle="primary"
                                            onClick={this.getTicketsWithFilter.bind(this)}>
                                            Apply
                                        </Button>
                                    </div>

                            </FormGroup>


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