import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well, Button, Panel} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import {TTTPost} from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import TicketListItem from './ticket-list-item';
import queryString from 'query-string';

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);
        const event_id = queryParams.event;

        this.state = {
            section: 112,
            tickets: [],
            price: 0,
            showFilter: false,
            selectedEvent: [],
            eventID: event_id,
            eventTitle: 'Choose a game'
        }

        this.getEventTitle();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    getEventTitle() {
        return this.state.selectedEvent.Title;
    }

    getEvent(eventID) {
        TTTPost('/get-event', {
            eventID: eventID
        })
        .then(res => {
            if (res.data.event) this.setState({
                selectedEvent: res.data.event
            });
        });
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

    getAllTickets() {
        TTTPost('/all-tickets', {
            event_id: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
    }

    getSelectedGame() {
        if (this.state.eventID === '') {
            eventTitle: 'Choose a game'
        }
        else {
            eventTitle: this.state.selectedEvent.Title
        }
    }

    _onButtonClick() {
        this.setState({
            showFilter: true
        });
    }


    onChartClick(section) {
        if (section.length > 0) {
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

    //render the values in the tickets
    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
            <li class="list-group-item" border-color="red" onclick="">
                Section: {ticket.section_number} Row: {ticket.row_number}
                <br></br>
                Seat: {ticket.seat_number} Price: {ticket.price}
                <br></br>
                <Button className="buy-button" bsSize="xsmall">Buy</Button>
            </li>
        );
    }

    render() {

        return (
            <div>
                <Grid style={{paddingTop: "100px"}}>
                    <h1 className="border-white">
                        <Well className='pick-tickets-well' style={{background: 'transparent'}}>
                            Choose Your Desired Section From The Seating Chart
                        </Well>
                    </h1>
                    <Row>
                        <Col lg={8}>
                            <Row>
                                <Col lg={8}>
                                    <Button onclick={this.getSelectedGame()}>
                                        {this.getEventTitle()}
                                    </Button>
                                </Col>
                            </Row>
                            <WellsFargoChart
                                onSectionSelected={this.onChartClick.bind(this)}
                                selectedSection={this.state.section}/>
                        </Col>
                        <Col lg={4}>
                            <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                              Filter
                            </Button>
                            <Panel collapsible expanded={this.state.showFilter}>
                                <FormGroup controlId="formControlsEmail">
                                    <ReactSliderNativeBootstrap
                                        className="price-slider"
                                        max={1000}
                                        min={1}
                                        step={1}
                                        tooltip="hide"
                                        handleChange={this.firstComponentChangeValue.bind(this)}
                                        value={this.state.firstComponentCurrentValue}
                                    />

                                    <ControlLabel
                                        className="slider-price-label">
                                        Ticket Price: ${this.state.price}
                                    </ControlLabel>

                                    <div>
                                        <div2>
                                            <ControlLabel
                                                id="sectionNumber"
                                                style={{color: 'black', fontSize: 15}}>
                                                Section Number:
                                            </ControlLabel>
                                        </div2>
                                        <div2>
                                            <FormControl style={{width: 50}} placeholder="Enter section #"
                                                         type="section"
                                                         value={this.state.section}
                                                         onChange={this.handleChange.bind(this)}/>
                                        </div2>
                                    </div>

                                    <div>
                                        <Button bsStyle="primary"
                                                onClick={this.getTicketsWithFilter.bind(this)}>
                                            Apply
                                        </Button>
                                    </div>
                                </FormGroup>
                            </Panel>

                            <h3 className="Tickets-label"> Tickets </h3>
                            <div className="ticket-border">
                                {this.renderTicketList()}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>

        );
    }
}