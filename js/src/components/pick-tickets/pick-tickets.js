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

        this.state = {
            section: 112,
            tickets: [],
            price: 0,
            showFilter: false,
            selectedEvent: [],
            eventID: '',
            eventTitle: 'Choose a game'
        }

        const queryParams = queryString.parse(this.props.location.search);
        const event_id = queryParams.event;
        if (event_id !== '' && event_id !== null) {
            this.setState({
                eventID: event_id
            });
            this.getAllTickets(event_id);
            this.getEvent(event_id);
        }
        else {
            this.setState({
                eventID: '-1',
                eventTitle: 'Choose a game'
            });
        }
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
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

    getAllTickets(eventID) {
        TTTPost('/all-ticket', {
            eventID: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) this.setState({
                    tickets: res.data.tickets
                });
            });
    }

    getSelectedGame() {
        if (this.state.selectedEvent === null) {
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

    renderTickets() {
        return _.map(this.state.tickets, (ticket, index) =>
            <option key={index} value={ticket.ticket_id}>
                Section: {ticket.section_number} Row: {ticket.row_number} Seat: {ticket.seat_number}
            </option>
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
                                    <Button>
                                        {this.getSelectedGame()}
                                        {this.state.eventTitle}
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
                            <TicketListItem ticketsFromPickTicket={this.state.tickets}/>
                        </Col>
                    </Row>
                </Grid>
            </div>

        );
    }
}