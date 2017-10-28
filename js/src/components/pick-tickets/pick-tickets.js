import React, { Component } from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well} from 'react-bootstrap';
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
            section: '',
            tickets: [],
            price: 0
        }
    }

    getTicketsWithFilter() {
        TTTGet("/pick-ticket-filter", {
            price: this.state.price,
            section: this.state.section
        })
            .then(res => {
                console.log(res);
                const tickets = res.data.tickets;
                this.setState({ tickets });
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
      console.log(this.state.priceChange);
      this.setState({ firstComponentCurrentValue: e.target.value });
      this.setState({ priceChange: e.target.value });
      return e.target.value;

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

                            <ReactSliderNativeBootstrap
                                     max={50}
                                     min={1}
                                     step={1}
                                     tooltip="hide"
                                     change={this.firstComponentChangeValue}
                                     value={this.state.firstComponentCurrentValue}
                                />

                                <ControlLabel
                                    id = "sliderPrice"
                                    style={{color: 'white', fontSize: 15}}>
                                    {this.state.price}
                                </ControlLabel>

                            <form>
                                <ControlLabel style={{color: 'white', fontSize: 15}}>Section #: </ControlLabel>
                                <input name="param1" value="test"/>
                                <input
                                    type="submit"
                                    name=""
                                    id="search-submit"
                                    class="button"
                                    value="Submit"
                                    onChange={this.getTicketsWithFilter()}
                                />
                            </form>


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