import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Well,
        Button, Panel, ToggleButtonGroup, ToggleButton, ButtonGroup,
        DropdownButton, MenuItem} from 'react-bootstrap';
import '../../seating-chart.css';
import '../pick-tickets/pick-tickets.css';
import _ from 'lodash';
import WellsFargoChart from './wells-fargo-chart';
import {TTTPost, TTTGet} from '../backend/ttt-request';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import TicketListItem from './ticket-list-item';
import queryString from 'query-string';
import { ClimbingBoxLoader } from 'react-spinners';
import {LinkContainer} from 'react-router-bootstrap';

var clickedSection = ''

export default class PickTickets extends Component {

    constructor(props) {
        super(props);

        const queryParams = queryString.parse(this.props.location.search);

        this.state = {
            sections: [],
            tickets: [],
            price: 0,
            showFilter: false,
            selectedEvent: null,
            eventID: queryParams.event,
            eventTitle: 'Choose a game',
            isLoading: false,
            previousSections: [],
            sliderValue: 0,
            toggleValue: 1
        }
        this.getEvent();
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    getEventTitle() {
        return this.state.selectedEvent.title;
    }

    getEvent() {
        TTTPost('/get-event', {
            eventID: this.state.eventID
        })
        .then(res => {
            try {
                if (res.data.event.authenticated) {
                    this.setState({
                        selectedEvent: {
                            title: res.data.event.title,
                            homeTeam: res.data.event.homeTeam,
                            awayTeam: res.data.event.awayTeam
                        },
                        eventTitle: res.data.event.title
                    });
                }
            }
            catch (e) {
                console.log(e);
            }

        });
    }

    selectTicket() {
         this.setState({tickets: [], previousSections: [], sections: []});
         this.getTicketsWithFilter();
    }

    getTicketsWithFilter() {
        this.setState({isLoading:true, tickets: [], toggleValue: 1});
        if(this.state.sections.length === 0) {
            TTTPost('/get-cheap-ticket-any-section', {
                eventID: this.state.eventID,
                price: this.state.price
            })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        tickets: res.data.tickets,
                        isLoading: false
                    });
                }
            });
        } else {
            TTTPost('/pick-ticket-filter', {
                eventID: this.state.eventID,
                price: this.state.price,
                sections: this.state.sections
            })
                .then(res => {
                    if (res.data.tickets) {
                        this.setState({
                            tickets: res.data.tickets,
                            isLoading: false
                        });
                    }
                });
        }
    }

    getExpensiveTicketsAndSections() {
        this.setState({isLoading:true, tickets: []});
        TTTPost('/pick-expensive-ticket', {
            eventID: this.state.eventID
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        tickets: res.data.tickets,
                        isLoading: false
                    });
                }
            });
    }

    getCheapestTickets() {
        this.setState({isLoading:true, tickets: []});        
        TTTPost('/pick-cheapest-ticket',{
            eventID: this.state.eventID            
        })
            .then(res => {
                if (res.data.tickets) {
                    this.setState({
                        tickets: res.data.tickets,
                        previousSections: this.state.sections,
                        sections: res.data.sections,
                        isLoading: false
                    });
                }
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
        if(this.state.sections.length === 1 && this.state.sections[0] === section) {
            this.setState({
                previousSections: this.state.sections,
                sections: [],
                tickets: [],
                toggleValue: 1
            });
        }
        else {
            this.setState({isLoading:true, tickets: []});    
            TTTPost('/tickets', {
                eventID: this.state.eventID,
                section_number: section
            })
                .then(res => {
                    if (res.data.tickets) {
                        this.setState({
                            previousSections: this.state.sections,
                            sections: [section],
                            tickets: res.data.tickets,
                            isLoading: false,
                            toggleValue: 1
                        });
                    }
                });
        }
    }

    onSliderChange(e) {
        this.setState({
            sliderValue: e.target.value,
            price: e.target.value
        });
    }

    onToggleChange(value) {
        this.setState({ toggleValue: value });
    }

    hasEventID() {
        if (this.state.eventID > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    eventButtonClick() {
        return <LinkContainer to='/event-calendar'/>;
    }

    //render the values in the tickets
    renderTicketList() {
        return _.map(this.state.tickets, (ticket, id) =>
            <li className="list-group-item" border-color="red">
                Section: {ticket.section_number} Row: {ticket.row_number}
                <br></br>
                Seat: {ticket.seat_number} Price: ${ticket.ticket_price}
                <br></br>
                <Button className="buy-button" bsSize="xsmall">Buy</Button>
            </li>
        );
    }

    render() {
        return (
            <div className="globalImage pick-tickets-bg-image">
                <div className="globalImageOverlay">
                    <Grid style={{paddingTop: "25px"}}>
                        <h1 className="border-white">
                            <Well className='pick-tickets-well' style={{background: '#006BB6'}}>
                                Pick-A-Ticket
                            </Well>
                        </h1>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col lg={8}>
                                        <ButtonGroup>
                                            <DropdownButton disabled={this.hasEventID()}
                                                title={this.state.eventTitle} id="bg-nested-dropdown">
                                                <LinkContainer to='/event-calendar'>
                                                    <MenuItem eventKey="By Team">By Team</MenuItem>
                                                </LinkContainer>
                                                <LinkContainer to='/event-calendar'>
                                                    <MenuItem eventKey="By Calendar">By Calendar</MenuItem>
                                                </LinkContainer>
                                            </DropdownButton>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                                <br/>
                                <WellsFargoChart
                                    onSectionSelected={this.onChartClick.bind(this)}
                                    selectedSections={this.state.sections}
                                    previousSections={this.state.previousSections}/>
                            </Col>
                            <Col lg={4}>
                                <Button onClick={() => this.setState({ showFilter: !this.state.showFilter })}>
                                  Filter
                                </Button>
                                <Panel collapsible expanded={this.state.showFilter}>
                                    <div>
                                        <ToggleButtonGroup
                                            id = "priceToggleGroup"
                                            name = "filterToggleGroup"
                                            type="radio"
                                            value={this.state.toggleValue}
                                            onChange={this.onToggleChange.bind(this)}>
                                                <ToggleButton id="selectPrice" value={1} onClick={this.selectTicket.bind(this)}>Select Price</ToggleButton>
                                                <ToggleButton id="lowestPrice" value={2} onClick={this.getCheapestTickets.bind(this)} >Lowest Price</ToggleButton>
                                                <ToggleButton id="highestPrice" value={3} onClick={this.getExpensiveTicketsAndSections.bind(this)} >Highest Price</ToggleButton>
                                        </ToggleButtonGroup>
                                    </div>
                                    <span> </span>
                                    <FormGroup controlId="formControlsEmail">
                                        <ReactSliderNativeBootstrap
                                            className="price-slider"
                                            max={1000}
                                            min={1}
                                            step={1}
                                            tooltip="hide"
                                            handleChange={this.onSliderChange.bind(this)}
                                            value={this.state.sliderValue}/>

                                        <ControlLabel
                                            className="slider-price-label">
                                            Ticket Price: ${this.state.price}
                                        </ControlLabel>

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
                                    <div align="center"> <ClimbingBoxLoader loading={this.state.isLoading}/> </div>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}